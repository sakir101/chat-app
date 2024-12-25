import { useRef, useState } from "react";
import { Send } from "lucide-react";
import { useSendMessageMutation } from "@/redux/api/message";
import { getUserInfo } from "@/services/auth.service";
import { useAppSelector } from "@/redux/hooks";
import { socket } from "@/socket/socket";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const { userId: id } = getUserInfo() as any;
  const { selectedUser } = useAppSelector((state) => state.chat);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !selectedUser) return;

    try {
      await sendMessage({
        id,
        receiverId: selectedUser._id,
        data: {
          text,
        },
      });

      setText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim()}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
