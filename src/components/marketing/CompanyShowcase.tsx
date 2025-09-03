"use client";

import { useEffect, useRef } from "react";

const companies = [
  { name: "Databricks", initials: "DB", color: "from-orange-500 to-red-500" },
  { name: "Anthropic", initials: "AN", color: "from-blue-500 to-purple-500" },
  { name: "OpenAI", initials: "OAI", color: "from-green-500 to-teal-500" },
  { name: "Stripe", initials: "ST", color: "from-purple-500 to-pink-500" },
  { name: "Hugging Face", initials: "HF", color: "from-yellow-500 to-orange-500" },
  { name: "Revolut", initials: "RE", color: "from-blue-500 to-indigo-500" },
  { name: "Checkout.com", initials: "CO", color: "from-teal-500 to-cyan-500" },
  { name: "DeepL", initials: "DL", color: "from-indigo-500 to-blue-500" }
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Stripe",
    quote: "Talent Wharf connected me with my dream role. The process was seamless and professional.",
  },
  {
    name: "Marcus Johnson", 
    role: "ML Engineer at OpenAI",
    quote: "Found my perfect team match through Talent Wharf's curated network.",
  },
  {
    name: "Elena Rodriguez",
    role: "Frontend Lead at Revolut", 
    quote: "The quality of opportunities through Talent Wharf is unmatched.",
  }
];

export default function CompanyShowcase() {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        carousel.scrollBy({ left: -240, behavior: "smooth" });
      } else if (e.key === "ArrowRight") {
        carousel.scrollBy({ left: 240, behavior: "smooth" });
      }
    };

    carousel.addEventListener("keydown", handleKeyDown);
    return () => carousel.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-white via-purple-50/20 to-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-semibold text-black mb-6 tracking-tight" style={{ letterSpacing: '-0.02em' }}>
            Join talent at leading companies
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed" style={{ letterSpacing: '-0.01em' }}>
            Connect with world-class teams at the most innovative companies in tech
          </p>
        </div>
        
        {/* Enhanced Company Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {companies.map((company, index) => (
            <div
              key={company.name}
              className="group animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center min-h-36 shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 group-hover:-translate-y-2">
                <div className={`w-16 h-16 bg-gradient-to-br ${company.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <span className="text-sm font-bold text-white">
                    {company.initials}
                  </span>
                </div>
                <span className="text-lg font-semibold text-gray-900 text-center group-hover:text-black transition-colors" style={{ letterSpacing: '-0.01em' }}>
                  {company.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Success Stories Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12">
          <h3 className="text-3xl md:text-4xl font-semibold text-center text-black mb-12" style={{ letterSpacing: '-0.01em' }}>
            Success Stories
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${(index + 4) * 100}ms` }}
              >
                <div className="mb-4">
                  <div className="flex text-blue-500 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    "{testimonial.quote}"
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-black text-sm">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          Success stories represent real placements. Company logos for illustration only.
        </p>
      </div>
    </section>
  );
}