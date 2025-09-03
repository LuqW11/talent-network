import { Suspense } from "react";
import Link from "next/link";
import Hero from "~/components/marketing/Hero";
import Button from "~/components/ui/Button";
import { preserveQuery } from "~/lib/utm";

interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}


export default async function HomePage({ searchParams }: HomePageProps) {
  // Await searchParams in Next.js 15
  const resolvedSearchParams = await searchParams;
  
  // Convert searchParams to URLSearchParams for preserveQuery
  const urlSearchParams = new URLSearchParams();
  if (resolvedSearchParams) {
    Object.entries(resolvedSearchParams).forEach(([key, value]) => {
      if (typeof value === 'string') {
        urlSearchParams.set(key, value);
      } else if (Array.isArray(value)) {
        urlSearchParams.set(key, value[0] || '');
      }
    });
  }

  const applyUrl = preserveQuery("/apply", urlSearchParams);

  return (
    <main className="h-screen bg-white overflow-hidden">
      <Hero applyUrl={applyUrl} />
    </main>
  );
}