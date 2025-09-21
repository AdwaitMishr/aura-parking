import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Shield, Users, MapPin, Clock, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    // The main container and all content is from your v0 generation.
    // We've removed the T3 placeholder gradient background for a cleaner look.
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-16 text-center">
          <h1 className="text-balance text-5xl font-bold mb-6">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              AuraPark
            </span>
          </h1>
          <p className="text-pretty mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
            Smart parking management system for the modern world. Find, book, and manage parking spots with ease.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="h-12 px-8">
              <Link href="/dashboard">
                <Car className="mr-2 h-5 w-5" />
                User Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 bg-transparent px-8">
              <Link href="/admin">
                <Shield className="mr-2 h-5 w-5" />
                Admin Panel
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mx-auto mb-16 grid max-w-5xl gap-8 md:grid-cols-3">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:bg-card/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <Car className="h-5 w-5 text-blue-500" />
                </div>
                Easy Booking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Book your parking spot in seconds with our intuitive interface and real-time availability
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:bg-card/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="rounded-lg bg-green-500/10 p-2">
                  <MapPin className="h-5 w-5 text-green-500" />
                </div>
                Real-time Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                See live parking availability and manage your bookings with instant notifications
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:bg-card/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="rounded-lg bg-purple-500/10 p-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                </div>
                Admin Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Comprehensive management tools for parking lot operators with detailed analytics
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-muted/50 p-6 text-center">
            <div className="mb-3 flex items-center justify-center">
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mb-1 text-2xl font-bold">1,000+</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </div>

          <div className="rounded-lg bg-muted/50 p-6 text-center">
            <div className="mb-3 flex items-center justify-center">
              <Clock className="h-8 w-8 text-green-500" />
            </div>
            <div className="mb-1 text-2xl font-bold">24/7</div>
            <div className="text-sm text-muted-foreground">System Uptime</div>
          </div>

          <div className="rounded-lg bg-muted/50 p-6 text-center">
            <div className="mb-3 flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mb-1 text-2xl font-bold">95%</div>
            <div className="text-sm text-muted-foreground">Efficiency Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}