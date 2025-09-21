import { createAuthClient } from "better-auth/react";
import { customSessionClient } from "better-auth/client/plugins";
import { auth } from "./auth";
export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL as string,
    plugins: [customSessionClient<typeof auth>()]
});
const signIn = async () => {
    const data = await authClient.signIn.social({
        provider: "google"
    })
}
export const { useSession, signOut } = authClient;
