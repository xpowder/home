import api from "@/lib/apiClient";

export interface Conversation {
  id: string;
  provider_id: string;
  provider_name?: string;
  provider_image?: string;
  client_id: string;
  client_name?: string;
  client_image?: string;
  subject?: string;
  last_message?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
  unread_count: number;
  is_muted: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name?: string;
  sender_image?: string;
  content: string;
  attachment?: string;
  attachment_type?: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConversationListResponse {
  conversations: Conversation[];
  total: number;
}

export interface MessageListResponse {
  messages: Message[];
  total: number;
  page: number;
  page_size: number;
}

export interface CreateConversationData {
  provider_id: string;
  client_id: string;
  subject?: string;
}

export interface SendMessageData {
  conversation_id: string;
  content: string;
  attachment?: File;
}

/**
 * Create or get a conversation
 */
export const createConversation = async (data: CreateConversationData) => {
  const response = await api.post<Conversation>("/messages/conversations", data);
  return response.data;
};

/**
 * Get all conversations for the current user
 */
export const getConversations = async (archived?: boolean) => {
  const params = archived !== undefined ? `?archived=${archived}` : "";
  const response = await api.get<ConversationListResponse>(
    `/messages/conversations${params}`
  );
  return response.data;
};

/**
 * Get a specific conversation
 */
export const getConversation = async (conversationId: string) => {
  const response = await api.get<Conversation>(
    `/messages/conversations/${conversationId}`
  );
  return response.data;
};

/**
 * Get messages for a conversation
 */
export const getMessages = async (
  conversationId: string,
  page: number = 1,
  pageSize: number = 50
) => {
  const response = await api.get<MessageListResponse>(
    `/messages/conversations/${conversationId}/messages?page=${page}&page_size=${pageSize}`
  );
  return response.data;
};

/**
 * Send a message
 */
export const sendMessage = async (data: SendMessageData) => {
  const formData = new FormData();
  formData.append("conversation_id", data.conversation_id);
  formData.append("content", data.content);
  if (data.attachment) {
    formData.append("attachment", data.attachment);
  }

  const response = await api.post<Message>("/messages/messages", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/**
 * Mark messages as read
 */
export const markMessagesRead = async (
  conversationId: string,
  messageIds?: string[]
) => {
  const response = await api.post("/messages/messages/mark-read", {
    conversation_id: conversationId,
    message_ids: messageIds || [],
  });
  return response.data;
};

/**
 * Delete a message
 */
export const deleteMessage = async (messageId: string) => {
  const response = await api.delete(`/messages/messages/${messageId}`);
  return response.data;
};

/**
 * Update conversation settings
 */
export const updateConversation = async (
  conversationId: string,
  data: {
    is_muted?: boolean;
    is_archived?: boolean;
    subject?: string;
  }
) => {
  const response = await api.put<Conversation>(
    `/messages/conversations/${conversationId}`,
    data
  );
  return response.data;
};

/**
 * Get unread message count
 */
export const getUnreadCount = async () => {
  const response = await api.get<{ status: string; unread_count: number }>(
    "/messages/unread-count"
  );
  return response.data;
};

