import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "../store/useChatStore";

interface ChatInfoSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatInfoSidebar: React.FC<ChatInfoSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const { selectedUser, messages } = useChatStore();
  const mediaMessages = messages.filter((message) => message.image);
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="absolute inset-0 bg-black/40 z-[50]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="absolute top-0 right-0 h-full w-[320px] bg-[#1c1d1f] text-white z-[60] shadow-xl border-l border-gray-700 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold">User Info</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col items-center py-6">
              <img
                src={selectedUser?.profilePic ?? ""}
                alt="avatar"
                className="w-24 h-24 rounded-full mb-3"
              />
              <h3 className="text-xl font-medium">
                {selectedUser?.fullName ?? ""}
              </h3>
              {/* <p className="text-gray-400 text-sm">last seen recently</p> */}
            </div>

            <div className="flex-1 overflow-y-auto px-4">
              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-sm text-gray-400 mb-2">Shared Media</h4>
                <div className="grid grid-cols-3 gap-2">
                  {mediaMessages.map((message, i) => (
                    <img
                      key={i}
                      src={message.image}
                      alt={`Media from ${selectedUser?.fullName}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
