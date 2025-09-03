"use client";

import Link from "next/link";
import Button from "~/components/ui/Button";

interface HeroProps {
  applyUrl: string;
}

export default function Hero({ applyUrl }: HeroProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif' }}>
      <div className="text-center space-y-16">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-semibold text-black tracking-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif', letterSpacing: '-0.02em' }}>
            Talent Wharf
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto font-normal leading-snug" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif', letterSpacing: '-0.01em' }}>
            Introducing top student engineers to world-class teams
          </p>
        </div>
        
        <div className="flex flex-col space-y-10 max-w-sm mx-auto">
          <div className="flex flex-col space-y-4">
            <Link href="/service">
              <Button variant="white" size="lg" className="w-full text-base py-4 rounded-xl font-medium" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                Our Service
              </Button>
            </Link>
            
            <Link href={applyUrl}>
              <Button variant="black" size="lg" className="w-full text-base py-4 rounded-xl font-medium" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                Apply Now
              </Button>
            </Link>
          </div>
          
          <div className="text-center space-x-8 text-xs text-gray-400" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
            <a href="/privacy" className="hover:text-gray-600 transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-gray-600 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </div>
  );
}