// src/lib/tokenCrypto.ts
import { env } from "./env";

const SECRET_KEY = env.ENCRYPTION_SECRET_KEY; // Must be 32 chars (256-bit)

// ------------------------------
// Base64 Helpers (Binary-Safe)
// ------------------------------
function bufferToBase64(buffer: ArrayBuffer | Uint8Array) {
  const bytes = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : buffer;
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function base64ToBuffer(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// ------------------------------
// AES Key Management
// ------------------------------
async function getKey() {
  if (!SECRET_KEY) {
    throw new Error("ENCRYPTION_SECRET_KEY is missing in env.");
  }

  if (SECRET_KEY.length !== 32) {
    throw new Error("ENCRYPTION_SECRET_KEY must be 32 characters (256-bit).");
  }

  return await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET_KEY),
    "AES-GCM",
    false,
    ["encrypt", "decrypt"]
  );
}

// ------------------------------
// Encrypt
// ------------------------------
export async function encrypt(text: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await getKey();

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(text)
  );

  const ivBase64 = bufferToBase64(iv);
  const dataBase64 = bufferToBase64(new Uint8Array(encrypted));

  return `${ivBase64}.${dataBase64}`;
}

// ------------------------------
// Decrypt
// ------------------------------
export async function decrypt(cipher: string): Promise<string | null> {
  try {
    const [ivStr, dataStr] = cipher.split(".");
    if (!ivStr || !dataStr) return null;

    const iv = base64ToBuffer(ivStr);
    const encryptedData = base64ToBuffer(dataStr);

    const key = await getKey();

    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encryptedData);

    return new TextDecoder().decode(decrypted);
  } catch {
    return null; // corrupted or invalid token
  }
}
