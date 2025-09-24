import { Car, Clock, ShieldCheck } from "lucide-react";

export function FeaturesSection() {
  return (
    <section id="features" className="bg-gray-800/50 py-20 md:py-28">
      <div className="container mx-auto px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Why Choose AuraPark?</h2>
          <p className="mt-4 text-gray-400">
            We leverage cutting-edge technology to make your parking experience seamless and stress-free.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Feature Cards */}
          <div className="flex flex-col items-center rounded-lg bg-gray-900 p-8 text-center">
             <div className="mb-4 rounded-full bg-cyan-500/10 p-4">
               <Clock className="h-8 w-8 text-cyan-400" />
             </div>
             <h3 className="text-xl font-semibold">Real-Time Availability</h3>
             <p className="mt-2 text-gray-400">
               Our system provides live updates on vacant spots, so you know where to go before you even arrive.
             </p>
          </div>
          {/* ... Add the other two feature cards here ... */}
          <div className="flex flex-col items-center rounded-lg bg-gray-900 p-8 text-center">
             <div className="mb-4 rounded-full bg-cyan-500/10 p-4">
               <Car className="h-8 w-8 text-cyan-400" />
             </div>
             <h3 className="text-xl font-semibold">Real-Time Availability</h3>
             <p className="mt-2 text-gray-400">
               Our system provides live updates on vacant spots, so you know where to go before you even arrive.
             </p>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-gray-900 p-8 text-center">
             <div className="mb-4 rounded-full bg-cyan-500/10 p-4">
               <ShieldCheck className="h-8 w-8 text-cyan-400" />
             </div>
             <h3 className="text-xl font-semibold">Real-Time Availability</h3>
             <p className="mt-2 text-gray-400">
               Our system provides live updates on vacant spots, so you know where to go before you even arrive.
             </p>
          </div>
        </div>
      </div>
    </section>
  );
}