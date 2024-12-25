"use client";

import ChatContainer from "@/components/Message/ChatContainer";
import NoChatSelected from "@/components/Message/NoChatSelected";
import Sidebar from "@/components/Message/Sidebar";
import { useAppSelector } from "@/redux/hooks";
import React from "react";

const ChatPage = () => {
  const { selectedUser } = useAppSelector((state) => state.chat);
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
