"use client"

import Link from "next/link";
import { Sun, User, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSession, authClient } from "@/lib/auth-client";

export function Header() {
  const { data: session, isPending } = useSession();
  const user = session?.user as any;

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/";
          }
        }
      });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <header className="container mx-auto flex items-center justify-between p-4 px-6 md:px-8">
      <Link href="/" className="flex items-center gap-2">
        <Sun className="h-6 w-6 text-cyan-400" />
        <span className="text-xl font-bold">AuraPark</span>
      </Link>
      
      <div className="flex items-center gap-4">
        {isPending ? (
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
        ) : session && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 text-white hover:text-cyan-400">
                {user.role === "ADMIN" ? (
                  <Shield className="h-4 w-4" />
                ) : (
                  <User className="h-4 w-4" />
                )}
                <span className="hidden md:inline">{user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={user.role === "ADMIN" ? "/admin" : "/dashboard"}>
                  {user.role === "ADMIN" ? "Admin Dashboard" : "Dashboard"}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild className="text-gray-300 hover:text-white">
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
            <Button asChild className="bg-cyan-500 hover:bg-cyan-600">
              <Link href="/auth/sign-up">Sign Up</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}