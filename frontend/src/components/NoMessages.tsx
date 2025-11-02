import Lottie from "lottie-react";
import lottie1 from "../assets/lottie/lottie1.json";
import { useChatStore } from "../store/useChatStore";

export const NoMessages: React.FC = () => {
  const { sendMessage } = useChatStore();

  const handleSendMessage = async () => {
    try {
      const payload = {
        text: "👋 hi",
        image: "",
      };

      await sendMessage(payload);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  return (
    <div className="flex justify-center items-center md:p-6">
      <div className="flex flex-col items-center justify-center h-full text-center select-none bg-base-200 p-10 rounded-xl md:mt-6">
        <div className=" w-20 h-20 md:w-40 md:h-40 mb-6">
          <Lottie animationData={lottie1} loop autoplay />
        </div>
        <p className="text-lg text-white/90 font-medium">
          No messages here yet...
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Send a message or tap on the greeting below.
        </p>
        <button
          onClick={handleSendMessage}
          className="mt-6 px-4 py-2 bg-blue-600/90 text-white text-sm rounded-full cursor-pointer hover:bg-blue-500 transition"
        >
          👋 Say hi
        </button>
      </div>
    </div>
  );
};
