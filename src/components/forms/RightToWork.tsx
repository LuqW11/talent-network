"use client";

import { useFormContext } from "react-hook-form";

export default function RightToWork() {
  const { register, watch, formState: { errors } } = useFormContext();
  
  const rightToWork = watch("rightToWork");
  const showVisaFields = rightToWork === "temporary";

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label htmlFor="rightToWork" className="block text-sm font-medium text-black mb-2 text-left">
            Right to work
          </label>
          <select
            {...register("rightToWork")}
            id="rightToWork"
            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none bg-white transition-colors text-base"
          >
            <option value="">Select your right to work status</option>
            <option value="rtw">I have the right to work in this location</option>
            <option value="sponsor">I will require sponsorship</option>
            <option value="temporary">I have temporary right (e.g. Graduate Visa)</option>
          </select>
        </div>

        {/* Conditional visa fields */}
        {showVisaFields && (
          <div className="mt-4 ml-7 space-y-4 border-l-2 border-gray-200 pl-4">
            <div>
              <label htmlFor="visaType" className="block text-sm font-medium text-black mb-2 text-left">
                Visa type <span className="text-gray-400">(optional)</span>
              </label>
              <input
                {...register("visaType")}
                type="text"
                id="visaType"
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none  text-base"
                placeholder="e.g., Graduate Route, Tier 2, etc."
                maxLength={40}
              />
              {errors.visaType && (
                <p className="mt-1 text-sm text-red-600">{errors.visaType.message as string}</p>
              )}
            </div>

            <div>
              <label htmlFor="visaExpiry" className="block text-sm font-medium text-black mb-2 text-left">
                Visa expiry <span className="text-gray-400">(optional)</span>
              </label>
              <input
                {...register("visaExpiry")}
                type="text"
                id="visaExpiry"
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none  text-base"
                placeholder="MM/YYYY"
                maxLength={7}
              />
              {errors.visaExpiry && (
                <p className="mt-1 text-sm text-red-600">{errors.visaExpiry.message as string}</p>
              )}
            </div>
          </div>
        )}

        <p className="text-sm text-gray-600">
          Where you're currently eligible to work. We never share visa details publicly.
        </p>

        {errors.rightToWork && (
          <p className="mt-2 text-sm text-red-600">{errors.rightToWork.message as string}</p>
        )}
      </div>
    </div>
  );
}