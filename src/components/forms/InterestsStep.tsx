"use client";

import { useFormContext } from "react-hook-form";
import { useEffect, useRef } from "react";
import ChipMultiSelect from "~/components/inputs/ChipMultiSelect";
import SkillSelect from "~/components/forms/SkillSelect";
import { DOMAIN_OPTIONS, ROLE_OPTIONS } from "~/lib/lists";

type RoleType = 'Backend SWE' | 'ML Platform' | 'Data Eng' | 'Platform-SRE' | 'Solutions Eng';

export default function InterestsStep() {
  const { 
    register, 
    watch, 
    setValue, 
    formState: { errors, isSubmitting } 
  } = useFormContext();
  
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  
  const domainInterests = watch("domainInterests") || [];
  const roleInterests = watch("roleInterests") || [];
  const skills = watch("skills") || [];
  const dreamStartups = watch("dreamStartups") || "";

  // Focus first error on submit failure
  useEffect(() => {
    if (Object.keys(errors).length > 0 && errorSummaryRef.current) {
      errorSummaryRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      
      // Focus first invalid control
      const firstErrorField = Object.keys(errors)[0];
      const firstErrorElement = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
      if (firstErrorElement) {
        setTimeout(() => firstErrorElement.focus(), 100);
      }
    }
  }, [errors]);

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="space-y-8">
      {/* Error Summary */}
      {hasErrors && (
        <div
          ref={errorSummaryRef}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
          role="alert"
          aria-live="polite"
        >
          <h3 className="text-sm font-medium text-red-800 mb-2">
            Please fix the following errors:
          </h3>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.domainInterests && (
              <li>• {errors.domainInterests.message as string}</li>
            )}
            {errors.roleInterests && (
              <li>• {errors.roleInterests.message as string}</li>
            )}
            {errors.skills && (
              <li>• {errors.skills.message as string}</li>
            )}
            {errors.dreamStartups && (
              <li>• {errors.dreamStartups.message as string}</li>
            )}
          </ul>
        </div>
      )}

      {/* Domain Interests */}
      <section>
        <ChipMultiSelect
          label="Domain interests (pick up to 3)"
          options={DOMAIN_OPTIONS}
          value={domainInterests}
          max={3}
          onChange={(next) => setValue("domainInterests", next, { shouldDirty: true })}
        />
        {errors.domainInterests && (
          <p className="mt-2 text-sm text-red-600">
            {errors.domainInterests.message as string}
          </p>
        )}
      </section>

      {/* Role Interests */}
      <section>
        <ChipMultiSelect
          label="Role interests"
          options={ROLE_OPTIONS}
          value={roleInterests}
          max={3}
          onChange={(next) => setValue("roleInterests", next, { shouldDirty: true })}
        />
        {errors.roleInterests && (
          <p className="mt-2 text-sm text-red-600">
            {errors.roleInterests.message as string}
          </p>
        )}
      </section>

      {/* Skills */}
      <section>
        <SkillSelect
          selectedRoles={roleInterests as RoleType[]}
          value={skills}
          onChange={(next) => setValue("skills", next, { shouldDirty: true })}
          max={10}
        />
        {errors.skills && (
          <p className="mt-2 text-sm text-red-600">
            {errors.skills.message as string}
          </p>
        )}
      </section>

      {/* Dream Startup Companies */}
      <section>
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Dream startup companies <span className="text-gray-400">(optional)</span>
          </label>
          <input
            {...register("dreamStartups")}
            type="text"
            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none transition-colors text-base"
            placeholder="Stripe, Anthropic, OpenAI…"
            maxLength={200}
          />
          {errors.dreamStartups && (
            <p className="mt-2 text-sm text-red-600">
              {errors.dreamStartups.message as string}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}