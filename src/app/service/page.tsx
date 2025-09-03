import HowItWorks from "~/components/marketing/HowItWorks";
import CompanyShowcase from "~/components/marketing/CompanyShowcase";
import Link from "next/link";
import Button from "~/components/ui/Button";

export default function ServicePage() {
  return (
    <main className="min-h-screen bg-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif' }}>
      {/* Enhanced header with back link */}
      <header className="relative bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-base font-medium text-gray-700 hover:text-black transition-all duration-200 group" 
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif', letterSpacing: '-0.01em' }}
          >
            <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center relative">
          {/* Floating background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
            <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
          </div>
          
          <div className="relative z-10 animate-fade-in-up">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-semibold text-black mb-8 tracking-tight" style={{ letterSpacing: '-0.02em' }}>
              Our Service
            </h1>
            <p className="text-2xl md:text-3xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12" style={{ letterSpacing: '-0.01em' }}>
              Connecting exceptional engineering talent with the world's most innovative companies
            </p>
            
            {/* Key metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 max-w-4xl mx-auto">
              <div className="text-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">95%</div>
                <div className="text-gray-600 text-sm md:text-base">Success Rate</div>
              </div>
              <div className="text-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">2k+</div>
                <div className="text-gray-600 text-sm md:text-base">Placements</div>
              </div>
              <div className="text-center animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <div className="text-4xl md:text-5xl font-bold text-teal-600 mb-2">50+</div>
                <div className="text-gray-600 text-sm md:text-base">Partner Companies</div>
              </div>
              <div className="text-center animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">7</div>
                <div className="text-gray-600 text-sm md:text-base">Day Avg Placement</div>
              </div>
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
              <Link href="/apply">
                <Button variant="black" size="lg" className="px-12 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  Apply Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif' }}>
        <HowItWorks />
        <CompanyShowcase />
      </div>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-black via-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight" style={{ letterSpacing: '-0.02em' }}>
            Ready to find your next opportunity?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of engineers who've found their dream roles through Talent Wharf
          </p>
          <Link href="/apply">
            <Button variant="white" size="lg" className="px-12 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-black mb-4" style={{ letterSpacing: '-0.01em' }}>Talent Wharf</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Connecting exceptional engineering talent with world-class opportunities since 2024
            </p>
            <div className="flex justify-center space-x-12 text-sm text-gray-500">
              <a href="/privacy" className="hover:text-gray-800 transition-colors duration-200">Privacy Policy</a>
              <a href="/terms" className="hover:text-gray-800 transition-colors duration-200">Terms of Service</a>
              <a href="mailto:hello@talentwharf.com" className="hover:text-gray-800 transition-colors duration-200">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}