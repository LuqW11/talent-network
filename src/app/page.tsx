import WaitlistForm from "~/components/WaitlistForm";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="max-w-2xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-5xl font-bold text-black mb-6">
          Talent Wharf
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Selective introductions to high growth, well-funded teams
        </p>
        <p className="text-sm text-gray-500 mb-12">
          Join the waitlist
        </p>

        {/* Form */}
        <WaitlistForm />
        
        {/* Trust Strip */}
        <div className="flex items-center justify-center space-x-8 text-sm font-medium text-gray-400 mt-12">
          <span>a16z</span>
          <span>•</span>
          <span>Sequoia</span>
          <span>•</span>
          <span>Index</span>
          <span>•</span>
          <span>GC</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="text-center">
          <div className="space-x-8 text-xs text-gray-400">
            <a href="/privacy" className="hover:text-gray-600">Privacy</a>
            <a href="/terms" className="hover:text-gray-600">Terms</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
