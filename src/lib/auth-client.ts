import { createAuthClient } from "better-auth/react";
import { customSessionClient } from "better-auth/client/plugins";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
    plugins: [
        customSessionClient(),
        adminClient()
    ]
});

export const { useSession, signOut } = authClient;
