import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { db, user } from "@/server/db"; // your drizzle instance
import { customSession } from "better-auth/plugins";
import { admin } from "better-auth/plugins";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", 
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    plugins: [
        admin({
            defaultRole: "USER",
            adminRoles: ["ADMIN"],
        }),
        customSession(async({session, user: sessionUser}) => {
            if(!session) return {session: null, user: null};
            const dbUser = await db.query.user.findFirst({
                where: eq(user.id, session.userId),
                columns: {
                    role: true,
                },
            });
            return {
                session,
                user: {
                    ...sessionUser,
                    role: dbUser?.role ?? 'USER',
                },
            };
        }),
    ],
    hooks: {
        before: createAuthMiddleware(async (ctx) => {
            if (ctx.path === "/sign-up/email") {
                const requestBody = ctx.body as any;
                const adminKey = requestBody?.adminKey;
                
                console.log("Before signup hook - adminKey:", adminKey); // Debug log
                console.log("Request body:", requestBody); // Debug log
                
                // Remove adminKey from body so it doesn't cause database issues
                if (requestBody?.adminKey) {
                    delete requestBody.adminKey;
                }
                
                // Store adminKey in context for after hook
                ctx.context.adminKey = adminKey;
            }
        }),
        after: createAuthMiddleware(async (ctx) => {
            if (ctx.path === "/sign-up/email") {
                const newSession = ctx.context.newSession;
                const adminKey = ctx.context.adminKey;
                
                if (newSession?.user && adminKey === "meow") {
                    console.log("Setting user as ADMIN"); // Debug log
                    // Update user role to ADMIN
                    await db.update(user)
                        .set({ role: "ADMIN" })
                        .where(eq(user.id, newSession.user.id));
                }
            }
        }),
    },
});
