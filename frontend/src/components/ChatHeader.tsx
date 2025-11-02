import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

type ChatHeaderProps = {
  onShowProfile: () => void;
  onClose: () => void;
};
const ChatHeader: React.FC<ChatHeaderProps> = ({ onShowProfile, onClose }) => {
  const { selectedUser, setSelectedUser } = useChatStore();

  return (
    <div
      className="p-2.5 border-b border-base-300 cursor-pointer bg-base-100"
      onClick={onShowProfile}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser?.profilePic || "/avatar.png"}
                alt={selectedUser?.fullName}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser?.fullName}</h3>
            <p className="text-sm text-base-content/70">Online</p>
          </div>
        </div>

        {/* Close button */}
        <button
          className="cursor-pointer"
          onClick={() => {
            setSelectedUser(null);
            onClose();
          }}
        >
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
