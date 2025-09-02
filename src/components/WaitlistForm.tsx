"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  step1Schema, 
  step2Schema, 
  roleOptions,
  type Step1Data, 
  type Step2Data, 
  type RoleOption
} from "~/lib/validation";
import UniversitySearch from "./UniversitySearch";

type FormStep = 1 | 2 | "success";

interface FormData extends Step1Data, Step2Data {}

const capitalizeFirst = (str: string) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const STORAGE_KEY = "talent-wharf-form-data";

export default function WaitlistForm() {
  const [step, setStep] = useState<FormStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
  });

  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
  });

  // Auto-focus first field when step changes
  useEffect(() => {
    if (firstFieldRef.current) {
      firstFieldRef.current.focus();
    }
  }, [step]);

  // Load and save form data
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData) as Partial<FormData>;
        if (parsed.firstName) step1Form.setValue("firstName", parsed.firstName);
        if (parsed.lastName) step1Form.setValue("lastName", parsed.lastName);
        if (parsed.email) step1Form.setValue("email", parsed.email);
        if (parsed.gdprConsent) step1Form.setValue("gdprConsent", parsed.gdprConsent);
        if (parsed.university) step2Form.setValue("university", parsed.university);
        if (parsed.gradYear) step2Form.setValue("gradYear", parsed.gradYear);
        if (parsed.roleInterests) step2Form.setValue("roleInterests", parsed.roleInterests);
        if (parsed.linkedinUrl) step2Form.setValue("linkedinUrl", parsed.linkedinUrl);
        if (parsed.githubUrl) step2Form.setValue("githubUrl", parsed.githubUrl);
      } catch (error) {
        console.error("Error loading saved form data:", error);
      }
    }
  }, [step1Form, step2Form]);

  const saveFormData = () => {
    const data = {
      ...step1Form.getValues(),
      ...step2Form.getValues(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const handleStep1Submit = (data: Step1Data) => {
    setIsTransitioning(true);
    setStep1Data(data);
    saveFormData();
    
    setTimeout(() => {
      setStep(2);
      setIsTransitioning(false);
    }, 300);
  };

  const handleBackToStep1 = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(1);
      setIsTransitioning(false);
    }, 300);
  };

  const handleStep2Submit = async (_data: Step2Data) => {
    setIsSubmitting(true);
    saveFormData();
    
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    localStorage.removeItem(STORAGE_KEY); // Clear saved data on success
    setStep("success");
    setIsSubmitting(false);
  };

  // Progress indicator component
  const ProgressIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium transition-colors ${
          step === 1 ? 'border-black bg-black text-white' : 'border-gray-300 bg-gray-100 text-gray-500'
        }`}>
          1
        </div>
        <div className={`w-12 h-0.5 transition-colors ${
          step === 2 || step === "success" ? 'bg-black' : 'bg-gray-200'
        }`} />
        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium transition-colors ${
          step === 2 ? 'border-black bg-black text-white' : 
          step === "success" ? 'border-green-600 bg-green-600 text-white' :
          'border-gray-300 bg-gray-100 text-gray-500'
        }`}>
          {step === "success" ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : '2'}
        </div>
      </div>
      <div className="ml-4 text-sm text-gray-600">
        {step === 1 && "Basic Information"}
        {step === 2 && "Additional Details"}
        {step === "success" && "Complete"}
      </div>
    </div>
  );

  const handleEditDetails = () => {
    setStep(1);
  };

  const toggleRoleInterest = (role: RoleOption) => {
    const current = step2Form.getValues("roleInterests") || [];
    const updated = current.includes(role)
      ? current.filter(r => r !== role)
      : [...current, role];
    
    step2Form.setValue("roleInterests", updated);
  };

  if (step === "success") {
    const allData = { ...step1Data, ...step2Form.getValues() };
    
    return (
      <div>
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-black mb-4">Welcome to the waitlist!</h2>
          <p className="text-gray-600 mb-8">We&apos;ll be in touch when we&apos;re ready to make introductions.</p>
          
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
              {allData.roleInterests && allData.roleInterests.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Interests:</span>
                  <span className="text-black font-medium">{allData.roleInterests.join(", ")}</span>
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={handleEditDetails}
            className="text-sm text-gray-500 hover:text-black transition-colors underline"
          >
            Start over
          </button>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <ProgressIndicator />
        
        {/* Step 1 Summary */}
        {step1Data && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-black">{step1Data.firstName} {step1Data.lastName}</span> • {step1Data.email}
            </p>
          </div>
        )}
        
        <form onSubmit={step2Form.handleSubmit(handleStep2Submit)} className="space-y-4">
        {/* University */}
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

        {/* Graduation Year */}
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

        {/* Role Interests */}
        <div>
          <label className="block text-sm text-black mb-2 text-left">
            Role interests <span className="text-gray-400 text-xs">(select all that apply)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {roleOptions.map((role) => {
              const isSelected = (step2Form.watch("roleInterests") || []).includes(role);
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRoleInterest(role)}
                  className={`px-4 py-2 text-sm rounded-lg border-2 transition-all duration-200 font-medium relative ${
                    isSelected
                      ? "bg-black text-white border-black shadow-md transform scale-105"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:shadow-sm"
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    {isSelected && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    <span>{role}</span>
                  </span>
                </button>
              );
            })}
          </div>
          {step2Form.formState.errors.roleInterests && (
            <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.roleInterests.message}</p>
          )}
        </div>

        {/* LinkedIn URL */}
        <div>
          <label className="block text-sm text-black mb-2 text-left">LinkedIn URL <span className="text-gray-400">(optional)</span></label>
          <input
            {...step2Form.register("linkedinUrl", {
              onChange: saveFormData
            })}
            type="url"
            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none transition-colors text-base"
            placeholder="https://linkedin.com/in/yourprofile"
          />
          {step2Form.formState.errors.linkedinUrl && (
            <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.linkedinUrl.message}</p>
          )}
        </div>

        {/* GitHub/Portfolio URL */}
        <div>
          <label className="block text-sm text-black mb-2 text-left">GitHub/Portfolio URL <span className="text-gray-400">(optional)</span></label>
          <input
            {...step2Form.register("githubUrl", {
              onChange: saveFormData
            })}
            type="url"
            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none transition-colors text-base"
            placeholder="https://github.com/yourusername"
          />
          {step2Form.formState.errors.githubUrl && (
            <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.githubUrl.message}</p>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex space-x-4 mt-8">
          <button
            type="button"
            onClick={handleBackToStep1}
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            ← Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-2 py-3 px-6 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : "Complete Registration"}
          </button>
        </div>
      </form>
      </div>
    );
  }

  // Step 1
  return (
    <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      <ProgressIndicator />
      
      <form onSubmit={step1Form.handleSubmit(handleStep1Submit)} className="space-y-4">
        {/* First Name & Last Name */}
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

      {/* Email */}
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

      {/* GDPR Consent */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6 text-left">
        <div className="flex items-start space-x-3">
          <input
            {...step1Form.register("gdprConsent")}
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          <label className="text-sm text-gray-600">
            I consent to processing of my personal data for the purpose of joining the waitlist and receiving updates.
          </label>
        </div>
        {step1Form.formState.errors.gdprConsent && (
          <p className="mt-2 text-sm text-red-600">{step1Form.formState.errors.gdprConsent.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full mt-8 py-3 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-medium"
      >
        Continue →
      </button>
    </form>
    </div>
  );
}