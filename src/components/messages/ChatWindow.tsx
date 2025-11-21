"use client";
import { Check, CheckCheck, Image as ImageIcon, Mic, MoreVertical, Paperclip, Send } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import { Conversation, getMessages, sendMessage, Message } from "@/services/message.services";
import { logger } from "@/lib/logger";
import { toast } from "sonner";
import { useAuth } from "@/store/AuthContext";

interface ChatWindowProps {
  conversation: Conversation;
  onNewMessage: () => void;
}

export default function ChatWindow({ conversation, onNewMessage }: ChatWindowProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Determine other user - if current user is provider, show client, and vice versa
  const { user: currentUser } = useAuth();
  const isProvider = currentUser?.role === "provider";
  const otherUserName = isProvider ? conversation.client_name : conversation.provider_name;
  const otherUserImage = isProvider 
    ? (conversation.client_image || "/home/latestOffers/avatar1.png")
    : (conversation.provider_image || "/home/latestOffers/avatar1.png");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await getMessages(conversation.id, 1, 50);
        setMessages(response.messages || []);
      } catch (error) {
        logger.error("Error fetching messages:", error);
        toast.error("Failed to load messages.");
      } finally {
        setLoading(false);
      }
    };

    if (conversation.id) {
      fetchMessages();
    }
  }, [conversation.id]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    const file = fileInputRef.current?.files?.[0] || imageInputRef.current?.files?.[0];
    const content = messageText.trim();
    
    if (!content && !file) {
      return;
    }

    try {
      setSending(true);
      
      // Backend requires content to not be empty, so use placeholder if only attachment
      await sendMessage({
        conversation_id: conversation.id,
        content: content || (file ? "📎 Attachment" : ""),
        attachment: file,
      });

      setMessageText("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (imageInputRef.current) imageInputRef.current.value = "";

      // Refresh messages
      const response = await getMessages(conversation.id, 1, 50);
      setMessages(response.messages || []);
      onNewMessage();
    } catch (error) {
      logger.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const isCurrentUser = (senderId: string) => {
    return user?.id === senderId;
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-subtext">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Chat Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10">
              <Image
                src={otherUserImage}
                alt={otherUserName}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-roboto text-heading text-base font-semibold">{otherUserName}</h3>
              <div className="flex items-center gap-2">
                <div className="bg-green-500 h-2 w-2 rounded-full"></div>
                <span className="text-subtext text-xs">Last active: 1 hour ago</span>
              </div>
            </div>
          </div>
          <button className="text-subtext hover:text-heading p-2 transition-colors">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-subtext">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isUser = isCurrentUser(message.sender_id);
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      isUser
                        ? "bg-primary text-white"
                        : "bg-white text-heading shadow-sm"
                    }`}
                  >
                    <p className={`text-sm ${isUser ? "text-white" : "text-heading"}`}>
                      {message.content}
                    </p>
                    <div className={`mt-1.5 flex items-center gap-1.5 text-xs ${
                      isUser ? "text-white/80" : "text-subtext"
                    }`}>
                      <span>{formatTime(message.created_at)}</span>
                      {isUser && (
                        <span className="flex items-center">
                          {message.is_read ? (
                            <CheckCheck className="h-3.5 w-3.5" />
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="flex items-center gap-2">
          {/* Attachment Icons */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-subtext hover:text-heading p-2 transition-colors"
            aria-label="Attach file"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={async (e) => {
              if (e.target.files?.[0]) {
                try {
                  setSending(true);
                  await sendMessage({
                    conversation_id: conversation.id,
                    content: "📎 Attachment",
                    attachment: e.target.files[0],
                  });
                  e.target.value = "";
                  const response = await getMessages(conversation.id, 1, 50);
                  setMessages(response.messages || []);
                  onNewMessage();
                } catch (error) {
                  logger.error("Error sending file:", error);
                  toast.error("Failed to send file.");
                } finally {
                  setSending(false);
                }
              }
            }}
          />

          <button
            onClick={() => imageInputRef.current?.click()}
            className="text-subtext hover:text-heading p-2 transition-colors"
            aria-label="Attach image"
          >
            <ImageIcon className="h-5 w-5" />
          </button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              if (e.target.files?.[0]) {
                try {
                  setSending(true);
                  await sendMessage({
                    conversation_id: conversation.id,
                    content: "📷 Image",
                    attachment: e.target.files[0],
                  });
                  e.target.value = "";
                  const response = await getMessages(conversation.id, 1, 50);
                  setMessages(response.messages || []);
                  onNewMessage();
                } catch (error) {
                  logger.error("Error sending image:", error);
                  toast.error("Failed to send image.");
                } finally {
                  setSending(false);
                }
              }
            }}
          />

          <button
            className="text-subtext hover:text-heading p-2 transition-colors"
            aria-label="Record audio"
          >
            <Mic className="h-5 w-5" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            placeholder="Type your message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
            className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={sending || (!messageText.trim() && !fileInputRef.current?.files?.[0] && !imageInputRef.current?.files?.[0])}
            className="bg-heading hover:bg-heading/90 disabled:bg-gray-300 flex h-10 w-10 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

