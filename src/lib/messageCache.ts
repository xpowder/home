// src/lib/messageCache.ts
import { Message } from "@/services/message.services";

const CACHE_PREFIX = "messages_cache_";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

interface CachedMessages {
  messages: Message[];
  cachedAt: number;
  conversationId: string;
}

/**
 * Get cached messages for a conversation
 */
export const getCachedMessages = (conversationId: string): Message[] | null => {
  if (typeof window === "undefined") return null;

  try {
    const cacheKey = `${CACHE_PREFIX}${conversationId}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) return null;

    const parsed: CachedMessages = JSON.parse(cached);
    
    // Check if cache is still valid
    if (Date.now() - parsed.cachedAt > CACHE_TTL) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    // Verify it's for the correct conversation
    if (parsed.conversationId !== conversationId) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return parsed.messages || [];
  } catch (error) {
    console.error("Error reading message cache:", error);
    return null;
  }
};

/**
 * Cache messages for a conversation
 */
export const cacheMessages = (conversationId: string, messages: Message[]): void => {
  if (typeof window === "undefined") return;

  try {
    const cacheKey = `${CACHE_PREFIX}${conversationId}`;
    const cacheData: CachedMessages = {
      messages,
      cachedAt: Date.now(),
      conversationId,
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.error("Error caching messages:", error);
    // If storage is full, try to clear old caches
    clearOldCaches();
  }
};

/**
 * Add a single message to the cache
 */
export const addMessageToCache = (conversationId: string, message: Message): void => {
  if (typeof window === "undefined") return;

  try {
    const existing = getCachedMessages(conversationId) || [];
    
    // Check if message already exists (avoid duplicates)
    const exists = existing.some((m) => m.id === message.id);
    if (exists) return;

    // Add new message and sort by created_at
    const updated = [...existing, message].sort((a, b) => {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    cacheMessages(conversationId, updated);
  } catch (error) {
    console.error("Error adding message to cache:", error);
  }
};

/**
 * Clear cache for a specific conversation
 */
export const clearConversationCache = (conversationId: string): void => {
  if (typeof window === "undefined") return;

  try {
    const cacheKey = `${CACHE_PREFIX}${conversationId}`;
    localStorage.removeItem(cacheKey);
  } catch (error) {
    console.error("Error clearing conversation cache:", error);
  }
};

/**
 * Clear all message caches (useful for cleanup)
 */
export const clearAllMessageCaches = (): void => {
  if (typeof window === "undefined") return;

  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error("Error clearing all message caches:", error);
  }
};

/**
 * Clear old caches that have expired
 */
const clearOldCaches = (): void => {
  if (typeof window === "undefined") return;

  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const parsed: CachedMessages = JSON.parse(cached);
            if (Date.now() - parsed.cachedAt > CACHE_TTL) {
              localStorage.removeItem(key);
            }
          }
        } catch {
          // If parsing fails, remove the invalid cache
          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    console.error("Error clearing old caches:", error);
  }
};

