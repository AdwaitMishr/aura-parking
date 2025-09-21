import Link from "next/link";

export function HeroSection() {
  return (
    <section className="container mx-auto flex flex-col items-center justify-center px-6 py-24 text-center md:py-32">
      <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
        Parking, <span className="text-cyan-400">Simplified</span>.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-gray-300 md:text-xl">
        Stop circling the block. Find, book, and pay for your parking spot in seconds with our intelligent, real-time system.
      </p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Link href="/dashboard" className="rounded-md bg-cyan-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-cyan-600">
          Find Parking Now
        </Link>
        <Link href="#features" className="rounded-md border border-gray-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-gray-800">
          Learn More
        </Link>
      </div>
    </section>
  );
}