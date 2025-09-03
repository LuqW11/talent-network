"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import WaitlistForm from "~/components/WaitlistForm";
import { pickParams } from "~/lib/utm";

function ApplyPageContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Store UTM parameters and referral token if they exist
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    const utmParams = pickParams(searchParams, utmKeys);
    
    // Store UTM parameters
    Object.entries(utmParams).forEach(([key, value]) => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, value);
      }
    });

    // Store referral token
    const refToken = searchParams.get('ref');
    if (refToken && !localStorage.getItem('tw_ref_from')) {
      localStorage.setItem('tw_ref_from', refToken);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Centered Form */}
      <main className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-2xl">
          <WaitlistForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="text-center">
          <div className="space-x-8 text-xs text-gray-400">
            <a href="/privacy" className="hover:text-gray-600">Privacy</a>
            <a href="/terms" className="hover:text-gray-600">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <ApplyPageContent />
    </Suspense>
  );
}