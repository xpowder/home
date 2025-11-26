import api from "@/lib/apiClient";

export interface Conversation {
  id: string;
  provider_id: string;
  provider_name: string;
  provider_email: string;
  client_id: string;
  client_name: string;
  client_email: string;
  subject?: string;
  last_message?: string; // Backend returns string preview, not object
  last_message_at?: string;
  unread_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Frontend computed fields
  provider_image?: string;
  client_image?: string;
  is_muted?: boolean;
  is_archived?: boolean;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: string;
  content: string;
  attachment_url?: string;
  attachment_type?: string;
  is_read: boolean;
  created_at: string;
  read_at?: string;
  // Frontend computed fields
  sender_image?: string;
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
 * Backend returns ConversationResponse directly (not wrapped)
 */
export const createConversation = async (data: CreateConversationData): Promise<Conversation> => {
  const response = await api.post<Conversation>("/messages/conversations", data);
  // Backend returns the conversation object directly
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
  
  // Backend requires content to be non-empty (min_length=1) and will strip whitespace
  // Ensure we always send a non-empty content string
  const contentToSend = (data.content && data.content.trim()) 
    ? data.content.trim() 
    : (data.attachment ? "📎 Attachment" : "Message");
  
  // Validate content length (backend max is 5000)
  if (contentToSend.length > 5000) {
    throw new Error("Message content cannot exceed 5000 characters");
  }
  
  if (contentToSend.length === 0) {
    throw new Error("Message content cannot be empty");
  }
  
  formData.append("content", contentToSend);
  
  if (data.attachment) {
    formData.append("attachment", data.attachment);
  }

    // Validate conversation_id is a valid UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(data.conversation_id)) {
      throw new Error("Invalid conversation ID format");
    }

    // Log FormData contents for debugging
    console.log("Sending message with FormData:", {
      conversation_id: data.conversation_id,
      originalContent: data.content,
      contentToSend: contentToSend,
      contentLength: contentToSend.length,
      hasAttachment: !!data.attachment,
      attachmentName: data.attachment?.name,
      attachmentSize: data.attachment?.size,
      attachmentType: data.attachment?.type,
    });
    
    // Log actual FormData entries (for debugging)
    if (typeof FormData !== 'undefined') {
      const formDataEntries: Record<string, any> = {};
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          formDataEntries[key] = {
            name: value.name,
            size: value.size,
            type: value.type,
          };
        } else {
          formDataEntries[key] = value;
        }
      }
      console.log("FormData entries:", formDataEntries);
    }

  try {
    // Don't set Content-Type header manually - axios will set it automatically with boundary
    // for FormData requests
    const response = await api.post<Message>("/messages/messages", formData);
    console.log("Message sent successfully:", response.data);
    return response.data;
  } catch (error: any) {
    // Log detailed error information
    const errorResponse = error?.response;
    const errorData = errorResponse?.data;
    
    console.error("Send message error:", {
      status: errorResponse?.status,
      statusText: errorResponse?.statusText,
      data: errorData,
      message: error?.message,
      contentSent: contentToSend,
      contentLength: contentToSend.length,
      hasAttachment: !!data.attachment,
    });
    
    // Extract error message from backend response
    let errorMessage = "Failed to send message. Please try again.";
    
    if (errorData) {
      // Backend returns error in format: { status: "error", message: "...", errors: [...] }
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
    
    // Create a new error with the extracted message
    const enhancedError = new Error(errorMessage);
    (enhancedError as any).response = errorResponse;
    (enhancedError as any).status = errorResponse?.status;
    
    throw enhancedError;
  }
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

