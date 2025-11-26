"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import ConversationList from "@/components/messages/ConversationList";
import ChatWindow from "@/components/messages/ChatWindow";
import ProviderProfileSidebar from "@/components/messages/ProviderProfileSidebar";
import { getConversations, getConversation, Conversation } from "@/services/message.services";
import { logger } from "@/lib/logger";
import { toast } from "sonner";

export default function ConversationDetailPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all conversations
        const conversationsResponse = await getConversations();
        setConversations(conversationsResponse.conversations || []);
        
        // Fetch the specific conversation
        if (conversationId) {
          const conversation = await getConversation(conversationId);
          setSelectedConversation(conversation);
        } else if (conversationsResponse.conversations && conversationsResponse.conversations.length > 0) {
          setSelectedConversation(conversationsResponse.conversations[0]);
        }
      } catch (error) {
        logger.error("Error fetching conversation data:", error);
        toast.error("Failed to load conversation. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [conversationId]);

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
    <div className="flex h-[calc(100vh-8vh)] w-full flex-col overflow-hidden bg-white dark:bg-gray-900 md:flex-row">
      {/* Left Column - Conversation List */}
      <div className="flex w-full flex-shrink-0 flex-col border-b border-gray-200 dark:border-gray-700 md:w-[320px] md:border-b-0 md:border-r lg:w-[350px]">
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
          <div className="flex h-full items-center justify-center bg-gray-50 dark:bg-gray-800">
            <div className="text-center">
              <p className="text-subtext dark:text-gray-400 text-lg">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Provider Profile Sidebar */}
      {selectedConversation && (
        <div className="hidden w-full flex-shrink-0 border-t border-gray-200 dark:border-gray-700 lg:block lg:w-[350px] lg:border-t-0 lg:border-l">
          <ProviderProfileSidebar conversation={selectedConversation} />
        </div>
      )}
    </div>
  );
}

