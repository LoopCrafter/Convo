import { useState } from "react";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import Sidebar from "../components/Sidebar";
import { useChatStore } from "../store/useChatStore";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const [showContent, setShowContent] = useState(false);
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-6rem)] sm:h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden relative">
            <Sidebar showContent={() => setShowContent(true)} />
            <div
              className={`max-sm:absolute  ${
                showContent ? "left-0" : "left-full"
              } top-0 w-full flex justify-center items-center h-full flex-1 flex-col overflow-auto overflow-x-hidden bg-base-100`}
            >
              {selectedUser ? (
                <ChatContainer onClose={() => setShowContent(false)} />
              ) : (
                <NoChatSelected />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
