"use client"

import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import { authClient } from "@/lib/auth-client";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <AuthUIProvider
      authClient={authClient}
      additionalFields={{
        adminKey: {
          label: "Admin Key (Optional)",
          placeholder: "Enter admin key for admin access",
          description: "Leave empty for regular user account",
          required: false,
          type: "string",
        },
      }}
      signUp={{
        fields: ["adminKey"],
      }}
    >
      {children}
    </AuthUIProvider>
  );
}
