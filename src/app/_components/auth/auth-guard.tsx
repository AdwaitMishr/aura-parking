"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { User } from "@/lib/types"
import { Shield, UserIcon } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: "user" | "admin"
}

export function AuthGuard({ children, requiredRole = "user" }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem("aurapark-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (role: "user" | "admin") => {
    // Mock authentication - in real app, this would validate credentials
    const mockUser: User = {
      id: "1",
      name: role === "admin" ? "Admin User" : "John Doe",
      email: loginForm.email || (role === "admin" ? "admin@aurapark.com" : "user@aurapark.com"),
      role: role,
    }

    setUser(mockUser)
    localStorage.setItem("aurapark-user", JSON.stringify(mockUser))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("aurapark-user")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || (requiredRole === "admin" && user.role !== "admin")) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to AuraPark</CardTitle>
            <CardDescription>
              {requiredRole === "admin" ? "Admin access required to continue" : "Please sign in to continue"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={requiredRole === "admin" ? "admin" : "user"} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="user" disabled={requiredRole === "admin"}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  User
                </TabsTrigger>
                <TabsTrigger value="admin">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin
                </TabsTrigger>
              </TabsList>

              <TabsContent value="user" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user-email">Email</Label>
                  <Input
                    id="user-email"
                    type="email"
                    placeholder="user@example.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-password">Password</Label>
                  <Input
                    id="user-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  />
                </div>
                <Button className="w-full" onClick={() => handleLogin("user")}>
                  Sign In as User
                </Button>
                <p className="text-xs text-muted-foreground text-center">Demo: Use any email/password to sign in</p>
              </TabsContent>

              <TabsContent value="admin" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@aurapark.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Admin Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter admin password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  />
                </div>
                <Button className="w-full" onClick={() => handleLogin("admin")}>
                  Sign In as Admin
                </Button>
                <p className="text-xs text-muted-foreground text-center">Demo: Use any email/password to sign in</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      {/* User info bar */}
      <div className="bg-muted/50 border-b px-4 py-2">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            {user.role === "admin" ? <Shield className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
            <span className="text-sm">
              Welcome, {user.name} ({user.role})
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </div>
      {children}
    </div>
  )
}
