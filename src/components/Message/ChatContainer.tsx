"use client";

import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeletons";
import { formatMessageTime } from "@/utils/formatMessageTimeFile";
import { useFetchMessagesQuery } from "@/redux/api/message";
import { getUserInfo } from "@/services/auth.service";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Image from "next/image";
import {
  socket,
  subscribeToMessages,
  unsubscribeFromMessages,
} from "../../socket/socket";
import { setMessages } from "@/redux/slice/chatSlice";

const ChatContainer = () => {
  const { userId: id } = getUserInfo() as any;
  const { selectedUser, messages } = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();
  const receiverId = selectedUser?._id;

  const {
    data: initialMessages,
    isLoading: isMessagesLoading,
    isError,
  } = useFetchMessagesQuery({
    id,
    receiverId,
  });

  useEffect(() => {
    dispatch(setMessages(initialMessages));
  }, [dispatch, initialMessages]);

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  // Handle subscription to new messages
  useEffect(() => {
    if (selectedUser && socket) {
      const handleNewMessage = (newMessage: any) => {
        const isMessageSentFromSelectedUser =
          newMessage.senderId === selectedUser._id;
        if (!isMessageSentFromSelectedUser) return;

        dispatch(setMessages([...messages, newMessage]));
      };
      subscribeToMessages(handleNewMessage);

      return () => {
        unsubscribeFromMessages();
      };
    }
  }, [selectedUser, messages, dispatch]);

  // Scroll to the latest message when messages change
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((message: any) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <Image
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  alt="profile pic"
                  width={48}
                  height={48}
                  className="object-cover rounded-full"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
