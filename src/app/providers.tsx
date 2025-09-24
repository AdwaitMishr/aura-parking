"use client"

import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

import { authClient } from "@/lib/auth-client"

export function Providers({ children }: { children: ReactNode }) {
    const router = useRouter()

    return (
        <AuthUIProvider
            authClient={authClient}
            navigate={(...args)=>router.push(...args)}
            replace={(...args)=>router.replace(...args)}
            onSessionChange={() => {
                router.refresh()
            }}
            social = {{
                providers: ['google']
            }}
            additionalFields={{
                adminKey: {
                    label: "Admin Key (Optional)",
                    placeholder: "Enter admin key for admin access",
                    description: "Leave empty for regular user account. Enter 'meow' for admin access.",
                    required: false,
                    type: "string",
                },
            }}
            signUp={{
                fields: ["adminKey"],
            }}
            Link={Link}
        >
            {children}
        </AuthUIProvider>
    )
}