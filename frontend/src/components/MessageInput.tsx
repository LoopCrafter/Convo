import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, SmilePlus, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import { EmojiPicker } from "./EmojiPicker";

interface SendMessagePayload {
  text: string;
  image: string | null;
}

const MessageInput: React.FC = () => {
  const { sendMessage, selectedUser, isTyping } = useChatStore();
  const { socket, user } = useAuthStore();
  const typingTimeout = useRef<any | null>(null);
  const [showEmojiBox, setShowEmojiBox] = useState(false);
  const [text, setText] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textInputRef = useRef<HTMLInputElement | null>(null);

  const handleEmojiSelect = (emoji: string) => {
    setText((prev) => {
      const newText = prev + emoji;
      setTimeout(() => {
        textInputRef.current?.focus();
        textInputRef.current?.setSelectionRange(newText.length, newText.length);
      }, 0);
      return newText;
    });
    setShowEmojiBox(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        textInputRef.current &&
        !textInputRef.current.contains(event.target as Node) &&
        !(event.target as Element)?.closest?.(".emoji-picker")
      ) {
        setShowEmojiBox(false);
      }
    };

    if (showEmojiBox) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiBox]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      const payload: SendMessagePayload = {
        text: text.trim(),
        image: imagePreview,
      };

      await sendMessage(payload);

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setText(value);
    const receiverId = selectedUser?.id;
    const senderId = user?.id;
    if (!value) {
      socket?.emit("typing", {
        receiverId,
        isTyping: false,
        senderId,
      });
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      return;
    }
    socket?.emit("typing", { receiverId, isTyping: true, senderId });

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket?.emit("typing", {
        receiverId,
        isTyping: false,
        senderId,
      });
    }, 500);
  };

  return (
    <div className="p-4 w-full relative">
      {isTyping ? (
        <span className="text-xs italic opacity-55 text-white absolute -top-3.5 left-5 flex items-center justify-start">
          <span>
            <span className="text-[11px]">{user?.fullName} </span>is typing
          </span>
          <span className="flex space-x-1 pt-2 scale-75">
            <span className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1 h-1 bg-white rounded-full animate-bounce"></span>
          </span>
        </span>
      ) : null}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2 items-center">
          <div className="flex-1 flex sm:relative">
            <EmojiPicker
              onClose={() => setShowEmojiBox(false)}
              onEmojiSelect={handleEmojiSelect}
              show={showEmojiBox}
            />

            <input
              ref={textInputRef}
              type="text"
              className="w-full input input-bordered rounded-lg input-sm sm:input-md sm:pl-10"
              placeholder="Type a message..."
              value={text}
              onChange={handleChangeInput}
            />
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-700 transition sm:absolute left-0.5 top-0.5 z-6 cursor-pointer opacity-50 hover:opacity-90"
              onClick={() => setShowEmojiBox((prev) => !prev)}
            >
              <SmilePlus className="size-5 hover:bg-transparent" />
            </button>
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
