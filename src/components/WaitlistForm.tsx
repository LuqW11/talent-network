"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  step1Schema, 
  step2Schema, 
  StepInterestsSchema,
  type Step1Data, 
  type Step2Data, 
  type StepInterestsData,
  migrateInterestsDraft
} from "~/lib/validation";
import UniversitySearch from "./UniversitySearch";
import LocationSearch from "./LocationSearch";
import InviteLinkCard from "./InviteLinkCard";
import CvDrop from "./CvDrop";
import InterestsStep from "./forms/InterestsStep";
import RightToWork from "./forms/RightToWork";
import ProofOfWork from "./forms/ProofOfWork";
import Button from "./ui/Button";
import { ReferralService } from "~/lib/referrals";

type FormStep = 1 | 2 | 3 | "success";

interface FormData extends Step1Data, Step2Data, StepInterestsData {}

const capitalizeFirst = (str: string) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const STORAGE_KEY = "talent-wharf-form-data";

export default function WaitlistForm() {
  const [step, setStep] = useState<FormStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Data | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      linkedinUrl: ""
    }
  });

  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      location: "",
      visaType: "",
      visaExpiry: "",
      githubUrl: "",
      proofOfWork: []
    }
  });

  const step3Form = useForm<StepInterestsData>({
    resolver: zodResolver(StepInterestsSchema),
    defaultValues: {
      domainInterests: [],
      roleInterests: [],
      skills: [],
      dreamStartups: ""
    }
  });

  // Capture referral token on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const refToken = urlParams.get('ref');
      if (refToken) {
        localStorage.setItem('tw_ref_from', refToken);
        const url = new URL(window.location.href);
        url.searchParams.delete('ref');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, []);

  // Auto-focus first field when step changes
  useEffect(() => {
    if (firstFieldRef.current) {
      firstFieldRef.current.focus();
    }
  }, [step]);

  // Load and save form data with migration
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        let parsed = JSON.parse(savedData) as Partial<FormData>;
        parsed = migrateInterestsDraft(parsed); // Migrate legacy data
        
        // Step 1 data
        if (parsed.firstName) step1Form.setValue("firstName", parsed.firstName);
        if (parsed.lastName) step1Form.setValue("lastName", parsed.lastName);
        if (parsed.email) step1Form.setValue("email", parsed.email);
        if (parsed.linkedinUrl) step1Form.setValue("linkedinUrl", parsed.linkedinUrl);
        if (parsed.gdprConsent) step1Form.setValue("gdprConsent", parsed.gdprConsent);
        
        // Step 2 data
        if (parsed.university) step2Form.setValue("university", parsed.university);
        if (parsed.gradYear) step2Form.setValue("gradYear", parsed.gradYear);
        if (parsed.cvMeta) step2Form.setValue("cvMeta", parsed.cvMeta);
        if (parsed.location) step2Form.setValue("location", parsed.location);
        if (parsed.rightToWork) step2Form.setValue("rightToWork", parsed.rightToWork);
        if (parsed.visaType) step2Form.setValue("visaType", parsed.visaType);
        if (parsed.visaExpiry) step2Form.setValue("visaExpiry", parsed.visaExpiry);
        if (parsed.githubUrl) step2Form.setValue("githubUrl", parsed.githubUrl);
        if (parsed.proofOfWork) step2Form.setValue("proofOfWork", parsed.proofOfWork);
        
        // Step 3 data
        if (parsed.domainInterests) step3Form.setValue("domainInterests", parsed.domainInterests);
        if (parsed.roleInterests) step3Form.setValue("roleInterests", parsed.roleInterests);
        if (parsed.skills) step3Form.setValue("skills", parsed.skills);
        if (parsed.dreamStartups) step3Form.setValue("dreamStartups", parsed.dreamStartups);
      } catch (error) {
        console.error("Error loading saved form data:", error);
      }
    }
  }, [step1Form, step2Form, step3Form]);

  const saveFormData = () => {
    const data = {
      ...step1Form.getValues(),
      ...step2Form.getValues(),
      ...step3Form.getValues(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const handleStep1Submit = (data: Step1Data) => {
    setIsTransitioning(true);
    setStep1Data(data);
    saveFormData();
    ReferralService.ensureRefToken();
    
    setTimeout(() => {
      setStep(2);
      setIsTransitioning(false);
    }, 300);
  };

  const handleStep2Submit = (data: Step2Data) => {
    setIsTransitioning(true);
    setStep2Data(data);
    saveFormData();
    
    setTimeout(() => {
      setStep(3);
      setIsTransitioning(false);
    }, 300);
  };

  const handleStep3Submit = async (_data: StepInterestsData) => {
    setIsSubmitting(true);
    saveFormData();
    
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    localStorage.removeItem(STORAGE_KEY);
    setStep("success");
    setIsSubmitting(false);
  };

  const handleBackToStep1 = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(1);
      setIsTransitioning(false);
    }, 300);
  };

  const handleBackToStep2 = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(2);
      setIsTransitioning(false);
    }, 300);
  };

  // Progress indicator component
  const ProgressIndicator = () => {
    const currentStepNum = step === 1 ? 1 : step === 2 ? 2 : step === 3 ? 3 : 3;
    const totalSteps = 3;
    
    const steps = [
      { number: 1, completed: step === 2 || step === 3 || step === "success", current: step === 1 },
      { number: 2, completed: step === 3 || step === "success", current: step === 2 },
      { number: 3, completed: step === "success", current: step === 3 }
    ];

    return (
      <nav aria-label="Progress" className="mb-16">
        {/* Mobile: Minimal step indicator */}
        <div className="md:hidden text-center mb-4">
          <p className="text-xs font-medium text-gray-400">
            Step {currentStepNum} of {totalSteps}
          </p>
        </div>

        {/* Desktop: Discreet progress dots */}
        <div className="hidden md:block">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              {steps.map((stepItem, index) => (
                <div key={stepItem.number} className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-medium transition-all duration-200 motion-safe:transition-all ${
                      stepItem.completed
                        ? 'bg-black border-black text-white'
                        : stepItem.current
                        ? 'bg-white border-black text-black'
                        : 'bg-gray-100 border-gray-300 text-gray-400'
                    }`}
                    aria-current={stepItem.current ? 'step' : undefined}
                  >
                    {stepItem.completed ? (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      stepItem.number
                    )}
                  </div>

                  {/* Connecting line */}
                  {index < steps.length - 1 && (
                    <div className="w-16 h-px mx-3 bg-gray-200 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 motion-safe:transition-all ${
                          steps[index + 1]?.completed || steps[index + 1]?.current
                            ? 'bg-black'
                            : 'bg-gray-200'
                        }`}
                        style={{
                          width: steps[index + 1]?.completed
                            ? '100%'
                            : steps[index + 1]?.current
                            ? '100%'
                            : '0%'
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: Minimal progress bar */}
        <div className="md:hidden">
          <div className="flex space-x-1">
            {steps.map((stepItem) => (
              <div
                key={stepItem.number}
                className={`flex-1 h-0.5 rounded-full transition-colors duration-300 ${
                  stepItem.completed || stepItem.current
                    ? 'bg-black'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </nav>
    );
  };

  const handleEditDetails = () => {
    setStep(1);
  };


  if (step === "success") {
    const allData = { ...step1Data, ...step2Data, ...step3Form.getValues() };
    
    return (
      <div>
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-black mb-4">Welcome to the waitlist!</h2>
          <p className="text-gray-600 mb-8">We'll be in touch when we're ready to make introductions.</p>
          
          {/* Summary of submitted data */}
          <div className="bg-gray-50 rounded-lg p-6 text-left space-y-3">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Your Registration Details:</h3>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="text-black font-medium">{allData.firstName} {allData.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="text-black font-medium">{allData.email}</span>
              </div>
              {allData.university && (
                <div className="flex justify-between">
                  <span className="text-gray-600">University:</span>
                  <span className="text-black font-medium">{allData.university}</span>
                </div>
              )}
              {allData.gradYear && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Graduation:</span>
                  <span className="text-black font-medium">{allData.gradYear}</span>
                </div>
              )}
              {allData.domainInterests && allData.domainInterests.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Domains:</span>
                  <span className="text-black font-medium">{allData.domainInterests.join(", ")}</span>
                </div>
              )}
              {allData.roleInterests && allData.roleInterests.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Roles:</span>
                  <span className="text-black font-medium">{allData.roleInterests.join(", ")}</span>
                </div>
              )}
              {allData.skills && allData.skills.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Skills:</span>
                  <span className="text-black font-medium">{allData.skills.slice(0, 3).join(", ")}{allData.skills.length > 3 ? "..." : ""}</span>
                </div>
              )}
              {allData.cvMeta && (
                <div className="flex justify-between">
                  <span className="text-gray-600">CV:</span>
                  <span className="text-black font-medium">{allData.cvMeta.name}</span>
                </div>
              )}
            </div>
          </div>
          
          <InviteLinkCard />
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <FormProvider {...step3Form}>
        <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <h2 className="text-2xl font-semibold text-black mb-8 text-center">
            Interests & Skills
          </h2>
          
          <ProgressIndicator />
          
          {/* Previous steps summary */}
          {step1Data && step2Data && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-black">{step1Data.firstName} {step1Data.lastName}</span> • {step1Data.email} • {step2Data.university}
              </p>
            </div>
          )}
          
          <form onSubmit={step3Form.handleSubmit(handleStep3Submit)} className="space-y-8">
            <InterestsStep />
            
            <div className="flex space-x-4 mt-8">
              <Button
                variant="outline"
                size="md"
                type="button"
                onClick={handleBackToStep2}
                className="flex-1"
                leftIcon={<span>←</span>}
              >
                Back
              </Button>
              <Button
                variant="black"
                size="md"
                type="submit"
                isLoading={isSubmitting}
                className="flex-2"
              >
                {isSubmitting ? "Submitting..." : "Complete Registration"}
              </Button>
            </div>
          </form>
        </div>
      </FormProvider>
    );
  }

  if (step === 2) {
    const hasErrors = Object.keys(step2Form.formState.errors).length > 0;
    
    return (
      <FormProvider {...step2Form}>
        <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <h2 className="text-2xl font-semibold text-black mb-8 text-center">
            Education & Professional Details
          </h2>
          
          <ProgressIndicator />
          
          {step1Data && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-black">{step1Data.firstName} {step1Data.lastName}</span> • {step1Data.email}
              </p>
            </div>
          )}

          {/* Error Summary */}
          {hasErrors && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4" role="alert" aria-live="polite">
              <h3 className="text-sm font-medium text-red-800 mb-2">
                Please fix the following errors:
              </h3>
              <ul className="text-sm text-red-700 space-y-1">
                {Object.entries(step2Form.formState.errors).map(([field, error]) => (
                  <li key={field}>• {error?.message as string}</li>
                ))}
              </ul>
            </div>
          )}
          
          <form onSubmit={step2Form.handleSubmit(handleStep2Submit)} className="space-y-6">
          <div>
            <label className="block text-sm text-black mb-2 text-left">CV Upload <span className="text-gray-400">(optional)</span></label>
            <CvDrop
              value={step2Form.watch("cvMeta") ?? null}
              onChange={(cvMeta) => {
                step2Form.setValue("cvMeta", cvMeta, { shouldDirty: true });
                saveFormData();
              }}
              error={step2Form.formState.errors.cvMeta?.message}
            />
          </div>

          <div>
            <label className="block text-sm text-black mb-2 text-left">University</label>
            <UniversitySearch
              value={step2Form.watch("university") || ""}
              onChange={(value) => {
                step2Form.setValue("university", value);
                saveFormData();
              }}
              placeholder="Search for your university..."
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none transition-colors text-base"
            />
            {step2Form.formState.errors.university && (
              <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.university.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-black mb-2 text-left">Expected graduation year</label>
            <select
              {...step2Form.register("gradYear", { 
                valueAsNumber: true,
                onChange: saveFormData
              })}
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none bg-white transition-colors text-base"
            >
              <option value="">Select year</option>
              {Array.from({ length: 4 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            {step2Form.formState.errors.gradYear && (
              <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.gradYear.message}</p>
            )}
          </div>

          {/* Location & Right to Work Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
            <div>
              <label className="block text-sm text-black mb-2 text-left">Location</label>
              <LocationSearch
                value={step2Form.watch("location") || ""}
                onChange={(value) => {
                  step2Form.setValue("location", value);
                  saveFormData();
                }}
                placeholder="Search for your location..."
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none transition-colors text-base"
              />
              <p className="mt-1 text-sm text-gray-600">Where you'll be based for the next 6–12 months.</p>
              {step2Form.formState.errors.location && (
                <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.location.message}</p>
              )}
            </div>

            <RightToWork />
          </div>

          {/* Proof of Work */}
          <ProofOfWork />

          <div className="flex space-x-4 mt-8">
            <Button
              variant="outline"
              size="md"
              type="button"
              onClick={handleBackToStep1}
              className="flex-1"
              leftIcon={<span>←</span>}
            >
              Back
            </Button>
            <Button
              variant="black"
              size="md"
              type="submit"
              className="flex-2"
              rightIcon={<span>→</span>}
            >
              Continue
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
    );
  }

  // Step 1
  return (
    <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      <h2 className="text-2xl font-semibold text-black mb-8 text-center">
        Basic details
      </h2>
      
      <ProgressIndicator />
      
      <form onSubmit={step1Form.handleSubmit(handleStep1Submit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-black mb-2 text-left">First name</label>
            <input
              {...step1Form.register("firstName", {
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  const capitalized = capitalizeFirst(e.target.value);
                  e.target.value = capitalized;
                  step1Form.setValue("firstName", capitalized);
                  saveFormData();
                }
              })}
              ref={firstFieldRef}
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none transition-colors text-base"
              placeholder="Jane"
            />
            {step1Form.formState.errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{step1Form.formState.errors.firstName.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm text-black mb-2 text-left">Last name</label>
            <input
              {...step1Form.register("lastName", {
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  const capitalized = capitalizeFirst(e.target.value);
                  e.target.value = capitalized;
                  step1Form.setValue("lastName", capitalized);
                  saveFormData();
                }
              })}
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none transition-colors text-base"
              placeholder="Smith"
            />
            {step1Form.formState.errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{step1Form.formState.errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm text-black mb-2 text-left">Email</label>
          <input
            {...step1Form.register("email", {
              onChange: saveFormData
            })}
            type="email"
            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none transition-colors"
            placeholder="jane@example.com"
          />
          {step1Form.formState.errors.email && (
            <p className="mt-1 text-sm text-red-600">{step1Form.formState.errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-black mb-2 text-left">LinkedIn URL <span className="text-gray-400">(optional)</span></label>
          <input
            {...step1Form.register("linkedinUrl", {
              onChange: saveFormData
            })}
            type="url"
            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none transition-colors text-base"
            placeholder="https://linkedin.com/in/yourprofile"
          />
          {step1Form.formState.errors.linkedinUrl && (
            <p className="mt-1 text-sm text-red-600">{step1Form.formState.errors.linkedinUrl.message}</p>
          )}
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg mt-6 text-left">
          <label 
            htmlFor="gdprConsent" 
            className="flex items-start space-x-3 p-4 cursor-pointer hover:bg-gray-100 transition-colors rounded-lg"
          >
            <input
              {...step1Form.register("gdprConsent")}
              id="gdprConsent"
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">
              I consent to processing of my personal data for the purpose of joining the waitlist and receiving updates.
            </span>
          </label>
          {step1Form.formState.errors.gdprConsent && (
            <p className="mx-4 pb-4 text-sm text-red-600">{step1Form.formState.errors.gdprConsent.message}</p>
          )}
        </div>

        <Button
          variant="black"
          size="md"
          type="submit"
          className="w-full mt-8"
          rightIcon={<span>→</span>}
        >
          Continue
        </Button>
      </form>
    </div>
  );
}