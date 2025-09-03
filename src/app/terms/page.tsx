import Link from "next/link";

export default function TermsPage() {
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
          Terms of Service
        </h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-black mb-4">Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using this service, you accept and agree to be bound by the terms 
              and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-medium text-black mb-4">Use License</h2>
            <p className="text-gray-700 mb-4">
              Permission is granted to temporarily use this service for personal, non-commercial 
              transitory viewing only.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-medium text-black mb-4">Disclaimer</h2>
            <p className="text-gray-700 mb-4">
              The materials on this service are provided on an 'as is' basis. We make no warranties, 
              expressed or implied, and hereby disclaim all other warranties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-medium text-black mb-4">Limitations</h2>
            <p className="text-gray-700 mb-4">
              In no event shall the company or its suppliers be liable for any damages arising 
              out of the use or inability to use the materials on this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-medium text-black mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms of Service, please contact us.
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