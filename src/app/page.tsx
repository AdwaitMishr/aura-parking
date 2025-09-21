// src/app/page.tsx
import { Header } from "@/app/_components/landing/header";
import { HeroSection } from "@/app/_components/landing/hero-section";
import { FeaturesSection } from "@/app/_components/landing/feature-section";
import { Footer } from "@/app/_components/landing/footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-white">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}