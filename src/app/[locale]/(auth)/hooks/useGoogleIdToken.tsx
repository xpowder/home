// hooks/useGoogleIdToken.tsx
"use client";

import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useCallback, useState } from "react";

export function useGoogleIdToken() {
  const [idToken, setIdToken] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const getToken = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      const handleSuccess = (response: CredentialResponse) => {
        if (response.credential) {
          setIdToken(response.credential);
          resolve(response.credential);
        } else {
          const err = new Error("No ID token returned");
          setError(err);
          reject(err);
        }
      };

      const handleError = () => {
        const err = new Error("Google Login Failed");
        setError(err);
        reject(err);
      };

      // Render invisible GoogleLogin button just to get the token
      const container = document.createElement("div");
      document.body.appendChild(container);

      const removeContainer = () => {
        if (container.parentNode) container.parentNode.removeChild(container);
      };

      const cleanup = (token: string | null) => {
        removeContainer();
        if (token) resolve(token);
      };

      const loginElement = (
        <GoogleLogin
          onSuccess={(res) => {
            handleSuccess(res);
            cleanup(res.credential || null);
          }}
          onError={() => {
            handleError();
            cleanup(null);
          }}
          useOneTap
          size="large"
        />
      );

      // Render into container
      import("react-dom/client").then((ReactDOMClient) => {
        const root = ReactDOMClient.createRoot(container);
        root.render(loginElement);
      });
    });
  }, []);

  return { idToken, error, getToken };
}
