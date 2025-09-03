const steps = [
  {
    number: 1,
    title: "Apply once",
    description: "Share your basic details and links.",
    icon: "📝"
  },
  {
    number: 2,
    title: "Invite to network", 
    description: "High-signal candidates are admitted to Talent Wharf.",
    icon: "🎯"
  },
  {
    number: 3,
    title: "Warm introductions",
    description: "We refer you to well-funded, high-growth teams.",
    icon: "🤝"
  },
  {
    number: 4,
    title: "Interview and ship",
    description: "Meet decision-makers and work on world-class projects.",
    icon: "🚀"
  }
];

export default function HowItWorks() {
  return (
    <section id="how" className="py-24 bg-gradient-to-b from-white via-blue-50/30 to-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif' }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-semibold text-black mb-6 tracking-tight" style={{ letterSpacing: '-0.02em' }}>
            How it works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed" style={{ letterSpacing: '-0.01em' }}>
            Four simple steps to connect exceptional talent with world-class opportunities
          </p>
        </div>
        
        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 via-blue-300 to-blue-200 transform -translate-x-1/2" />
          
          <div className="space-y-12 md:space-y-20">
            {steps.map((step, index) => (
              <div 
                key={step.number} 
                className={`relative group animate-fade-in-up`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`flex flex-col md:flex-row items-center gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}>
                  {/* Content */}
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group-hover:-translate-y-1">
                      <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                        <span className="text-2xl">{step.icon}</span>
                        <h3 className="text-2xl font-semibold text-black" style={{ letterSpacing: '-0.01em' }}>
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Step indicator */}
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center font-semibold text-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                      {step.number}
                    </div>
                  </div>
                  
                  {/* Spacer for alternating layout */}
                  <div className="flex-1 hidden md:block" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}