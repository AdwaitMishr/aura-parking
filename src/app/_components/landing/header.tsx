import Link from "next/link";
import { Sun } from "lucide-react";

export function Header() {
  return (
    <header className="container mx-auto flex items-center justify-between p-4 px-6 md:px-8">
      <Link href="/" className="flex items-center gap-2">
        <Sun className="h-6 w-6 text-cyan-400" />
        <span className="text-xl font-bold">AuraPark</span>
      </Link>
      <nav className="hidden items-center gap-6 md:flex">
        <Link href="#features" className="text-gray-300 hover:text-white">Features</Link>
        <Link href="/login" className="text-gray-300 hover:text-white">Login</Link>
      </nav>
      <Link href="/dashboard" className="rounded-md bg-cyan-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-cyan-600">
        Get Started
      </Link>
    </header>
  );
}