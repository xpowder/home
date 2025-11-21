// src/lib/env.ts

type EnvVars = {
  NEXT_PUBLIC_BACKEND_API_URL: string;
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: string;
  ENCRYPTION_SECRET_KEY: string;
  NEXT_PUBLIC_TEST_BACKEND_LOCALLY: string;
};

const requiredEnvVars: Record<keyof EnvVars, string> = {
  NEXT_PUBLIC_BACKEND_API_URL:
    process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000/api",
  NEXT_PUBLIC_GOOGLE_CLIENT_ID:
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "dummy-google-client-id",
  ENCRYPTION_SECRET_KEY:
    process.env.NEXT_PUBLIC_ENCRYPTION_SECRET_KEY || "p8X4NsJzR1F3Q9LmT7KbD8CfE6V2W0Hs",
  NEXT_PUBLIC_TEST_BACKEND_LOCALLY: process.env.NEXT_PUBLIC_TEST_BACKEND_LOCALLY || "false",
};

// Export validated env variables
export const env: EnvVars = requiredEnvVars as EnvVars;
