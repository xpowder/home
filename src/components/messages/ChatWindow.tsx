"use client";
import { Check, CheckCheck, Image as ImageIcon, Mic, MoreVertical, Paperclip, Send } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import { Conversation, getMessages, sendMessage, Message } from "@/services/message.services";
import { logger } from "@/lib/logger";
import { toast } from "sonner";
import { useAuth } from "@/store/AuthContext";
import { getCachedMessages, cacheMessages } from "@/lib/messageCache";

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
    const fetchMessages = async (retryCount = 0) => {
      // Load cached messages first for instant display
      const cached = getCachedMessages(conversation.id);
      if (cached && cached.length > 0) {
        setMessages(cached);
        setLoading(false);
        logger.info(`Loaded ${cached.length} cached messages for conversation ${conversation.id}`);
      }

      try {
        setLoading(true);
        const response = await getMessages(conversation.id, 1, 50);
        const freshMessages = response.messages || [];
        
        // Update state with fresh messages
        setMessages(freshMessages);
        
        // Cache the fresh messages
        cacheMessages(conversation.id, freshMessages);
        logger.info(`Cached ${freshMessages.length} messages for conversation ${conversation.id}`);
      } catch (error: any) {
        logger.error("Error fetching messages:", error);
        
        // If we have cached messages, keep showing them silently
        // Only show a subtle notification if cache is very old (more than 10 minutes)
        if (cached && cached.length > 0) {
          logger.info("Using cached messages due to API error");
          
          // Only show notification if cache is significantly old and it's a persistent error
          if (retryCount > 0) {
            const cacheKey = `messages_cache_${conversation.id}`;
            try {
              const cacheData = localStorage.getItem(cacheKey);
              if (cacheData) {
                const parsed = JSON.parse(cacheData);
                const cacheAge = Date.now() - (parsed.cachedAt || 0);
                const tenMinutes = 10 * 60 * 1000;
                
                // Only show if cache is older than 10 minutes
                if (cacheAge > tenMinutes) {
                  toast.info("Using cached messages. Some may be outdated.", {
                    duration: 2000,
                  });
                }
              }
            } catch {
              // Silently fail - don't show notification
            }
          }
          return;
        }
        
        // If it's a 500 error, it's likely a backend issue
        if (error?.response?.status === 500) {
          // Retry once after 2 seconds
          if (retryCount === 0) {
            logger.info("Retrying message fetch after 500 error...");
            setTimeout(() => {
              fetchMessages(1);
            }, 2000);
            return;
          }
          toast.error("Server error loading messages. Please refresh the page.");
        } else {
          toast.error("Failed to load messages.");
        }
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
      
      // Backend requires content to not be empty (min_length=1)
      // Always provide content, use placeholder if only attachment
      const messageContent = content || (file ? "📎 Attachment" : "Message");
      
      await sendMessage({
        conversation_id: conversation.id,
        content: messageContent,
        attachment: file,
      });

      // Message sent successfully
      setMessageText("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (imageInputRef.current) imageInputRef.current.value = "";

      // Try to refresh messages (if this fails, message was still sent)
      try {
        const response = await getMessages(conversation.id, 1, 50);
        const freshMessages = response.messages || [];
        setMessages(freshMessages);
        
        // Cache the updated messages
        cacheMessages(conversation.id, freshMessages);
        
        onNewMessage();
        toast.success("Message sent!");
      } catch (refreshError: any) {
        // Message was sent but refresh failed - this is a backend issue
        logger.error("Message sent but failed to refresh:", refreshError);
        
        // Optimistically add the message to the UI if we can
        const optimisticMessage: Message = {
          id: `temp-${Date.now()}`,
          conversation_id: conversation.id,
          sender_id: user?.id || "",
          sender_name: user?.first_name && user?.last_name 
            ? `${user.first_name} ${user.last_name}`
            : user?.email || "You",
          sender_role: user?.role || "client",
          content: messageContent,
          attachment_url: file ? URL.createObjectURL(file) : undefined,
          attachment_type: file ? (file.type.startsWith("image/") ? "image" : "file") : undefined,
          created_at: new Date().toISOString(),
          is_read: false,
        };
        
        // Update state and cache
        setMessages((prev) => {
          const updated = [...prev, optimisticMessage];
          cacheMessages(conversation.id, updated);
          return updated;
        });
        
        if (refreshError?.response?.status === 500) {
          toast.success("Message sent! (Server error refreshing - please refresh page)");
        } else {
          toast.success("Message sent! (Refreshing messages...)");
        }
        onNewMessage();
      }
    } catch (error: any) {
      // Actual send failure
      logger.error("Error sending message:", error);
      
      // Extract detailed error message
      let errorMessage = "Failed to send message. Please try again.";
      
      if (error?.response?.data) {
        const errorData = error.response.data;
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          // Pydantic validation errors
          const firstError = errorData.errors[0];
          errorMessage = firstError.message || firstError.msg || errorMessage;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      
      // If email verification is required, show a more helpful message
      if (error?.response?.status === 403 && errorMessage.includes("email")) {
        toast.error("Please verify your email address before sending messages.");
      }
      
      // Log full error details for debugging
      console.error("Full error details:", {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        message: error?.message,
      });
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
      <div className="flex h-full items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-subtext dark:text-gray-400">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-900">
      {/* Chat Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10">
              <Image
                src={otherUserImage}
                alt={otherUserName}
                fill
                sizes="40px"
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-roboto text-heading dark:text-white text-base font-semibold">{otherUserName}</h3>
              <div className="flex items-center gap-2">
                <div className="bg-green-500 h-2 w-2 rounded-full"></div>
                <span className="text-subtext dark:text-gray-400 text-xs">Last active: 1 hour ago</span>
              </div>
            </div>
          </div>
          <button className="text-subtext dark:text-gray-400 hover:text-heading dark:hover:text-white p-2 transition-colors">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-subtext dark:text-gray-400">No messages yet. Start the conversation!</p>
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
                        : "bg-white dark:bg-gray-700 text-heading dark:text-white shadow-sm"
                    }`}
                  >
                    <p className={`text-sm ${isUser ? "text-white" : "text-heading dark:text-white"}`}>
                      {message.content}
                    </p>
                    <div className={`mt-1.5 flex items-center gap-1.5 text-xs ${
                      isUser ? "text-white/80" : "text-subtext dark:text-gray-400"
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
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <div className="flex items-center gap-2">
          {/* Attachment Icons */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-subtext dark:text-gray-400 hover:text-heading dark:hover:text-white p-2 transition-colors"
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
                  
                  try {
                    const response = await getMessages(conversation.id, 1, 50);
                    const freshMessages = response.messages || [];
                    setMessages(freshMessages);
                    cacheMessages(conversation.id, freshMessages);
                  } catch (refreshError) {
                    // If refresh fails, add optimistic message
                    const optimisticMessage: Message = {
                      id: `temp-${Date.now()}`,
                      conversation_id: conversation.id,
                      sender_id: user?.id || "",
                      sender_name: user?.first_name && user?.last_name 
                        ? `${user.first_name} ${user.last_name}`
                        : user?.email || "You",
                      sender_role: user?.role || "client",
                      content: "📎 Attachment",
                      attachment_url: URL.createObjectURL(e.target.files[0]),
                      attachment_type: "file",
                      created_at: new Date().toISOString(),
                      is_read: false,
                    };
                    setMessages((prev) => {
                      const updated = [...prev, optimisticMessage];
                      cacheMessages(conversation.id, updated);
                      return updated;
                    });
                  }
                  onNewMessage();
                } catch (error: any) {
                  logger.error("Error sending file:", error);
                  const errorMessage = error?.response?.data?.message || error?.message || "Failed to send file.";
                  toast.error(errorMessage);
                } finally {
                  setSending(false);
                }
              }
            }}
          />

          <button
            onClick={() => imageInputRef.current?.click()}
            className="text-subtext dark:text-gray-400 hover:text-heading dark:hover:text-white p-2 transition-colors"
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
                  
                  try {
                    const response = await getMessages(conversation.id, 1, 50);
                    const freshMessages = response.messages || [];
                    setMessages(freshMessages);
                    cacheMessages(conversation.id, freshMessages);
                  } catch (refreshError) {
                    // If refresh fails, add optimistic message
                    const optimisticMessage: Message = {
                      id: `temp-${Date.now()}`,
                      conversation_id: conversation.id,
                      sender_id: user?.id || "",
                      sender_name: user?.first_name && user?.last_name 
                        ? `${user.first_name} ${user.last_name}`
                        : user?.email || "You",
                      sender_role: user?.role || "client",
                      content: "📷 Image",
                      attachment_url: URL.createObjectURL(e.target.files[0]),
                      attachment_type: "image",
                      created_at: new Date().toISOString(),
                      is_read: false,
                    };
                    setMessages((prev) => {
                      const updated = [...prev, optimisticMessage];
                      cacheMessages(conversation.id, updated);
                      return updated;
                    });
                  }
                  onNewMessage();
                } catch (error: any) {
                  logger.error("Error sending image:", error);
                  const errorMessage = error?.response?.data?.message || error?.message || "Failed to send image.";
                  toast.error(errorMessage);
                } finally {
                  setSending(false);
                }
              }
            }}
          />

          <button
            className="text-subtext dark:text-gray-400 hover:text-heading dark:hover:text-white p-2 transition-colors"
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
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-heading dark:text-white px-4 py-2.5 text-sm placeholder:text-subtext dark:placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:focus:border-primary"
          />

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={sending || (!messageText.trim() && !fileInputRef.current?.files?.[0] && !imageInputRef.current?.files?.[0])}
            className="bg-heading dark:bg-primary hover:bg-heading/90 dark:hover:bg-primary/90 disabled:bg-gray-300 dark:disabled:bg-gray-600 flex h-10 w-10 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

