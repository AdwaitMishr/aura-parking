"use client"

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, UserIcon } from "lucide-react"
import { useSession, authClient } from "@/lib/auth-client"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: "USER" | "ADMIN"
}

export function AuthGuard({ children, requiredRole = "USER" }: AuthGuardProps) {
  const { data: session, isPending } = useSession()

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard"
      })
    } catch (error) {
      console.error("Sign in error:", error)
    }
  }

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/"
          }
        }
      })
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Check if user is authenticated and has required role
  const user = session?.user as any // Custom session includes role
  const hasRequiredRole = !requiredRole || user?.role === requiredRole

  if (!session || !user) {
    // Redirect to sign-in page
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/sign-in';
    }
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  if (!hasRequiredRole) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>
              {requiredRole} role required to access this page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-sm text-destructive">
                Your current role: {user?.role || "No role assigned"}
              </p>
              <div className="space-y-2">
                <Button variant="outline" onClick={handleSignOut} className="w-full">
                  Sign out and try different account
                </Button>
                <Button variant="ghost" asChild className="w-full">
                  <Link href="/">Return to Home</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* User info bar */}
      <div className="bg-muted/50 border-b px-4 py-2">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            {user.role === "ADMIN" ? <Shield className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
            <span className="text-sm">
              Welcome, {user.name} ({user.role})
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
      {children}
    </div>
  )
}
