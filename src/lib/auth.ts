import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, user } from "@/server/db"; // your drizzle instance
import { customSession } from "better-auth/plugins";
import { eq } from "drizzle-orm";
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", 
    }),
    emailAndPassword : {
        enabled: true,
    },
    socialProviders : {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    plugins: [
        customSession(async({session, user: sessionUser}) => {
            if(!session) return {session: null, user: null};
            const dbUser = await db.query.user.findFirst({
                where: eq(user.id, session.userId),
                    columns:{
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
    ]
});
