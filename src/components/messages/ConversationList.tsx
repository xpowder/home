"use client";
import { Search } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

import { Conversation } from "@/services/message.services";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (conversation: Conversation) => void;
  loading: boolean;
}

export default function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  loading,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((conv) => {
    const searchLower = searchQuery.toLowerCase();
    const name = (conv.provider_name || conv.client_name || "").toLowerCase();
    const lastMessage = (conv.last_message?.content || "").toLowerCase();
    return name.includes(searchLower) || lastMessage.includes(searchLower);
  });

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-subtext">Loading conversations...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <h2 className="font-poppins text-heading mb-4 text-xl font-semibold">Messages</h2>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="text-subtext absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex h-full items-center justify-center p-4">
            <p className="text-subtext text-center text-sm">
              {searchQuery ? "No conversations found" : "No conversations yet"}
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            const isSelected = conversation.id === selectedConversationId;
            // Determine other user based on current user role (will be set from auth context)
            // For now, show provider name if available, otherwise client name
            const otherUser = conversation.provider_name || conversation.client_name || "User";
            const otherUserImage = conversation.provider_image || conversation.client_image || "/home/latestOffers/avatar1.png";
            const serviceType = conversation.subject || "Service";

            return (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className={`cursor-pointer border-b border-gray-100 p-4 transition-colors hover:bg-gray-50 ${
                  isSelected ? "bg-primary/5 border-l-4 border-l-primary" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Profile Picture */}
                  <div className="relative h-12 w-12 flex-shrink-0">
                    <Image
                      src={otherUserImage}
                      alt={otherUser}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>

                  {/* Conversation Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-roboto text-heading truncate text-sm font-semibold">
                        {otherUser}
                      </h3>
                      {conversation.unread_count > 0 && (
                        <span className="bg-primary ml-2 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium text-white">
                          {conversation.unread_count}
                        </span>
                      )}
                    </div>
                    <p className="text-subtext mt-1 truncate text-xs">
                      {conversation.last_message || "No messages yet"}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-subtext text-xs">{serviceType}</span>
                      <span className="text-subtext text-xs">•</span>
                      <span className="text-subtext text-xs">
                        {formatTimeAgo(conversation.last_message_at || conversation.updated_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

