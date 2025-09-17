import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL as string
});
const signIn = async () => {
    const data = await authClient.signIn.social({
        provider: "google"
    })
}
export const { useSession, signOut } = authClient;
