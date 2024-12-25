"use client";

import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Image from "next/image";
import { setSelectedUser } from "@/redux/slice/chatSlice";

const ChatHeader = () => {
  const { selectedUser } = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <Image
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                alt={selectedUser?.fullName || "User Avatar"} // Provide fallback text
                width={48} // Set desired width
                height={48} // Set desired height
                className="object-cover rounded-full"
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">
              {selectedUser?.fullName || "Unknown User"}
            </h3>{" "}
            {/* Fallback name */}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => dispatch(setSelectedUser(null))} // Allow null to deselect the user
          className="p-2 rounded-full hover:bg-base-300 transition-colors"
        >
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
