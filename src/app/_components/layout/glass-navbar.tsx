"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Menu, Home, Car, Settings, User, Shield, Moon, Sun, LogOut, Bell, Search } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Input } from "@/components/ui/input"

export function GlassNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/dashboard", icon: Car, label: "Dashboard" },
    { href: "/admin", icon: Shield, label: "Admin Panel" },
  ]

  const userMenuItems = [
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: Bell, label: "Notifications", href: "/notifications", badge: "3" },
  ]

  return (
    <>
      {/* Glass Effect Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40 supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 bg-background/95 backdrop-blur-md">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center space-x-2 mb-8">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Car className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-xl font-bold">AuraPark</span>
                    </div>

                    {/* Navigation Links */}
                    <div className="space-y-2 mb-8">
                      {navItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start space-x-3 h-12"
                            onClick={() => setIsOpen(false)}
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </Button>
                        </Link>
                      ))}
                    </div>

                    {/* User Menu */}
                    <div className="space-y-2 mb-8">
                      <h3 className="text-sm font-medium text-muted-foreground px-3 mb-2">Account</h3>
                      {userMenuItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start space-x-3 h-12"
                            onClick={() => setIsOpen(false)}
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="ml-auto">
                                {item.badge}
                              </Badge>
                            )}
                          </Button>
                        </Link>
                      ))}
                    </div>

                    {/* Theme Toggle & Logout */}
                    <div className="mt-auto space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start space-x-3 h-12"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      >
                        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start space-x-3 h-12 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Sign Out</span>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Car className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-bold hidden sm:block">AuraPark</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button variant="ghost" className="space-x-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              ))}
            </div>

            {/* Search and Actions */}
            <div className="flex items-center space-x-2">
              <div className="hidden sm:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search spots..."
                    className="pl-10 w-64 bg-background/50 backdrop-blur-sm border-border/40"
                  />
                </div>
              </div>

              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">3</Badge>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hidden md:flex"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <Button variant="ghost" size="icon" className="hidden md:flex">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  )
}
