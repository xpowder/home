"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/store/AuthContext";
import { getConversations, getUnreadCount, Conversation } from "@/services/message.services";
import { logger } from "@/lib/logger";

export function useMessageNotifications() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const lastMessageIdsRef = useRef<Set<string>>(new Set());
  const conversationsRef = useRef<Conversation[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);
  const isOnMessagesPage = typeof window !== "undefined" && pathname?.includes("/messages");

  // Ensure this only runs on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Request notification permission on mount (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch((err) => {
        logger.error("Error requesting notification permission:", err);
      });
    }
  }, []);

  // Poll for new messages (only on client side)
  useEffect(() => {
    if (!isMounted || typeof window === "undefined" || authLoading || !user) {
      return;
    }

    const checkForNewMessages = async () => {
      try {
        // Get unread count
        const unreadResponse = await getUnreadCount();
        const newUnreadCount = unreadResponse.unread_count || 0;

        // Get conversations to check for new messages
        const conversationsResponse = await getConversations();
        const conversations = conversationsResponse.conversations || [];

        // On initial load, store current message IDs to avoid notifying about existing messages
        if (isInitialLoadRef.current) {
          conversations.forEach((conv) => {
            if (conv.last_message_at) {
              // Store conversation ID with timestamp as key for tracking
              lastMessageIdsRef.current.add(`${conv.id}-${conv.last_message_at}`);
            }
          });
          isInitialLoadRef.current = false;
          setUnreadCount(newUnreadCount);
          conversationsRef.current = conversations;
          return;
        }

        // Check for new messages (messages we haven't seen before)
        const conversationsWithNewMessages = conversations.filter((conv) => {
          if (!conv.unread_count || conv.unread_count === 0) return false;
          
          // Check if this is a new message (not seen before)
          const messageKey = `${conv.id}-${conv.last_message_at}`;
          if (lastMessageIdsRef.current.has(messageKey)) {
            return false; // Already seen this message
          }
          
          // This is a new message
          lastMessageIdsRef.current.add(messageKey);
          return true;
        });

        if (conversationsWithNewMessages.length > 0 && newUnreadCount > unreadCount) {
          // Get the most recent conversation with new unread messages
          const latestConversation = conversationsWithNewMessages.sort(
            (a, b) =>
              new Date(b.last_message_at || b.updated_at).getTime() -
              new Date(a.last_message_at || a.updated_at).getTime()
          )[0];

          // Determine sender name
          const senderName =
            user.role === "provider"
              ? latestConversation.client_name
              : latestConversation.provider_name;

          const messagePreview =
            latestConversation.last_message || "New message received";

          // Only show notification if not on messages page
          if (!isOnMessagesPage && typeof window !== "undefined") {
            // Show browser notification
            if ("Notification" in window && Notification.permission === "granted") {
              try {
                const notification = new Notification(`${senderName} sent you a message`, {
                  body: messagePreview,
                  icon: "/favicon.ico",
                  badge: "/favicon.ico",
                  tag: `message-${latestConversation.id}-${Date.now()}`, // Prevent duplicate notifications
                });

                notification.onclick = () => {
                  window.focus();
                  router.push(`/${pathname?.split("/")[1] || "en"}/messages`);
                  notification.close();
                };

                // Auto close after 5 seconds
                setTimeout(() => notification.close(), 5000);
              } catch (error) {
                logger.error("Error showing browser notification:", error);
              }
            }

            // Show toast notification
            toast.info(`New message from ${senderName}`, {
              description: messagePreview,
              action: {
                label: "View",
                onClick: () => {
                  router.push(`/${pathname?.split("/")[1] || "en"}/messages`);
                },
              },
              duration: 5000,
            });
          }
        }

        setUnreadCount(newUnreadCount);
        conversationsRef.current = conversations;
      } catch (error) {
        logger.error("Error checking for new messages:", error);
      }
    };

    // Check immediately
    checkForNewMessages();

    // Then check every 30 seconds
    intervalRef.current = setInterval(checkForNewMessages, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [user, authLoading, unreadCount, isOnMessagesPage, router, pathname, isMounted]);

  // Only return unreadCount after component is mounted (client-side only)
  if (!isMounted) {
    return { unreadCount: 0 };
  }

  return { unreadCount };
}

