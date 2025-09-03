import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif' }}>
      {/* Simple header with back link */}
      <header className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link 
            href="/" 
            className="text-base font-medium text-black hover:text-gray-600 transition-colors duration-200" 
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif', letterSpacing: '-0.01em' }}
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold text-black mb-8" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif', letterSpacing: '-0.02em' }}>
          Privacy Policy
        </h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-black mb-4">Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              We collect information you provide directly to us, such as when you create an account, 
              fill out a form, or contact us for support.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-medium text-black mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use the information we collect to provide, maintain, and improve our services, 
              communicate with you, and comply with legal obligations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-medium text-black mb-4">Information Sharing</h2>
            <p className="text-gray-700 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as described in this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-medium text-black mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy, please contact us.
            </p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="text-center">
          <div className="space-x-8 text-xs text-gray-400" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
            <a href="/privacy" className="hover:text-gray-600 transition-colors duration-200">Privacy</a>
            <a href="/terms" className="hover:text-gray-600 transition-colors duration-200">Terms</a>
          </div>
        </div>
      </footer>
    </main>
  );
}