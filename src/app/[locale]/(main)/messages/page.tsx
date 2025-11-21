"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ConversationList from "@/components/messages/ConversationList";
import ChatWindow from "@/components/messages/ChatWindow";
import ProviderProfileSidebar from "@/components/messages/ProviderProfileSidebar";
import { getConversations, Conversation } from "@/services/message.services";
import { logger } from "@/lib/logger";
import { toast } from "sonner";

export default function MessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await getConversations();
        setConversations(response.conversations || []);
        
        if (response.conversations && response.conversations.length > 0) {
          // Select first conversation by default
          setSelectedConversation(response.conversations[0]);
        }
      } catch (error) {
        logger.error("Error fetching conversations:", error);
        toast.error("Failed to load conversations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleNewMessage = () => {
    const fetchConversations = async () => {
      try {
        const response = await getConversations();
        setConversations(response.conversations || []);
        
        if (selectedConversation) {
          const updated = response.conversations?.find((c) => c.id === selectedConversation.id);
          if (updated) {
            setSelectedConversation(updated);
          }
        }
      } catch (error) {
        logger.error("Error refreshing conversations:", error);
      }
    };
    fetchConversations();
  };

  return (
    <div className="flex h-[calc(100vh-8vh)] w-full overflow-hidden bg-white">
      {/* Left Column - Conversation List */}
      <div className="flex w-full flex-shrink-0 flex-col border-r border-gray-200 md:w-[350px]">
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversation?.id}
          onSelectConversation={handleSelectConversation}
          loading={loading}
        />
      </div>

      {/* Middle Column - Chat Window */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            onNewMessage={handleNewMessage}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-50">
            <div className="text-center">
              <p className="text-subtext text-lg">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Provider Profile Sidebar */}
      {selectedConversation && (
        <div className="hidden w-[350px] flex-shrink-0 border-l border-gray-200 lg:block">
          <ProviderProfileSidebar conversation={selectedConversation} />
        </div>
      )}
    </div>
  );
}

