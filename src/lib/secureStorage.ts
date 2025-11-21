// src/lib/secureStorage.ts
import { logger } from "./logger";
import { decrypt, encrypt } from "./tokenCrypto";

export const secureStorage = {
  async set(key: string, value: string) {
    if (typeof window === "undefined") return false;

    try {
      const encrypted = await encrypt(value);
      localStorage.setItem(key, encrypted);
      return true;
    } catch (err) {
      logger.error("Error Storing Token", err);
      return false;
    }
  },

  async get(key: string): Promise<string | null> {
    if (typeof window === "undefined") return null;

    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;

      const decrypted = await decrypt(encrypted);
      return decrypted;
    } catch {
      return null;
    }
  },

  remove(key: string) {
    if (typeof window === "undefined") return false;

    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  clear() {
    if (typeof window === "undefined") return false;

    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  },

  async showAllTokens() {
    // ---- Disable in production ----
    if (process.env.NODE_ENV === "production") {
      console.warn("secureStorage.showAllTokens() is disabled in production.");
      return;
    }

    if (typeof window === "undefined") return;

    const rows: Array<{
      key: string;
      encrypted: string | null;
      decrypted: string | null;
    }> = [];

    const keys = Object.keys(localStorage);

    if (keys.length === 0) {
      console.log("%cNo tokens found in localStorage.", "color:gray");
      return;
    }

    for (const key of keys) {
      const encrypted = localStorage.getItem(key);

      let decrypted: string | null = null;

      try {
        decrypted = encrypted ? await decrypt(encrypted) : "(null)";
      } catch {
        decrypted = "(failed to decrypt)";
      }

      rows.push({
        key,
        encrypted,
        decrypted,
      });
    }

    console.log(
      "%c====== Secure Storage Debug ======",
      "color:#9C27B0; font-size:18px; font-weight:bold"
    );

    console.table(rows);

    console.log("%c====== End Debug ======", "color:#9C27B0; font-size:18px; font-weight:bold");
  },
};
