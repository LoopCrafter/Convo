import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime, isSingleEmoji } from "../lib/utils";
import MessageInput from "./MessageInput";
import { ChatInfoSidebar } from "./ChatInfoSidebar";
import { NoMessages } from "./NoMessages";

type ChatContainerProps = {
  onClose: () => void;
};
const ChatContainer: React.FC<ChatContainerProps> = ({ onClose }) => {
  const {
    selectedUser,
    getMessages,
    messages,
    isMessagesLoading,
    subscribeToMessage,
    unsubscribeFromMessages,
    subscribeToTyping,
    unsubscribeFromTyping,
  } = useChatStore();
  const { user } = useAuthStore();
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser.id);
    }
    subscribeToMessage();
    subscribeToTyping();

    return () => {
      unsubscribeFromMessages();
      unsubscribeFromTyping();
      setOpenSidebar(false);
    };
  }, [selectedUser, getMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col overflow-auto relative overflow-x-hidden chat-container w-full">
      <ChatInfoSidebar
        isOpen={openSidebar}
        onClose={() => setOpenSidebar(false)}
      />
      <ChatHeader
        onShowProfile={() => setOpenSidebar(true)}
        onClose={onClose}
      />
      {isMessagesLoading ? (
        <MessageSkeleton />
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length ? (
            messages.map((message) => (
              <div
                key={message.id}
                className={`chat ${
                  message.sender === user?.id ? "chat-end" : "chat-start"
                }`}
                ref={messageEndRef}
              >
                <div className=" chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img
                      src={
                        message.sender === user?.id
                          ? user?.profilePic || "/avatar.png"
                          : selectedUser?.profilePic || "/avatar.png"
                      }
                      alt="profile pic"
                    />
                  </div>
                </div>
                <div className="chat-header mb-1">
                  <time className="text-xs opacity-50 ml-1">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>
                <div className="chat-bubble flex flex-col">
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2"
                    />
                  )}
                  {isSingleEmoji(message.text) ? (
                    <span className="text-3xl md:text-5xl leading-none block">
                      {message.text}
                    </span>
                  ) : (
                    message.text && <p>{message.text}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <NoMessages />
          )}
        </div>
      )}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
