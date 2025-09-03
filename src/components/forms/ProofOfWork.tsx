"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { useState, useEffect } from "react";

interface ProofOfWorkEntry {
  url?: string;
  note?: string;
}

export default function ProofOfWork() {
  const { control, register, formState: { errors }, setValue, watch, getValues } = useFormContext();
  
  const saveFormData = () => {
    const data = getValues();
    if (typeof window !== 'undefined') {
      localStorage.setItem("talent-wharf-form-data", JSON.stringify(data));
    }
  };
  const { fields, append, remove } = useFieldArray({
    control,
    name: "proofOfWork"
  });

  const [urlValidation, setUrlValidation] = useState<{ [key: number]: boolean }>({});
  
  // Ensure at least one entry exists
  useEffect(() => {
    if (fields.length === 0) {
      append({ url: "", note: "" });
    }
  }, [fields.length, append]);

  const handleUrlBlur = (index: number, value: string) => {
    if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
      const prefixedUrl = `https://${value}`;
      setValue(`proofOfWork.${index}.url`, prefixedUrl);
    }
    
    // Basic URL validation
    const isValid = value === "" || /^https?:\/\/.+\..+/.test(value);
    setUrlValidation(prev => ({ ...prev, [index]: isValid }));
  };

  const addAnotherEntry = () => {
    if (fields.length < 2) {
      append({ url: "", note: "" });
    }
  };

  const removeEntry = (index: number) => {
    if (fields.length > 1 && index > 0) {
      remove(index);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-black mb-2 text-left">
          Proof of work <span className="text-gray-400">(optional)</span>
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          Share your best work — projects, demos, or anything that showcases your skills.
        </p>
      </div>

      {/* GitHub URL Field */}
      <div>
        <label htmlFor="githubUrl" className="block text-sm font-medium text-black mb-2 text-left">
          GitHub/Portfolio URL <span className="text-gray-400">(optional)</span>
        </label>
        <input
          {...register("githubUrl", {
            onChange: saveFormData
          })}
          type="url"
          id="githubUrl"
          className="w-full px-4 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none transition-colors text-base"
          placeholder="https://github.com/yourusername"
        />
        {errors.githubUrl && (
          <p className="mt-1 text-sm text-red-600">
            {(errors.githubUrl as any).message as string}
          </p>
        )}
      </div>

      {fields.map((field, index) => {
        const noteValue = watch(`proofOfWork.${index}.note`) || "";
        const remainingChars = 280 - noteValue.length;
        
        return (
          <div key={field.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-medium text-gray-900">
                Project {index + 1}
              </h5>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeEntry(index)}
                  className="text-gray-400 hover:text-red-500 text-sm underline focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                >
                  Remove
                </button>
              )}
            </div>

            <div>
              <label htmlFor={`proofOfWork.${index}.url`} className="block text-sm font-medium text-black mb-2 text-left">
                Project link
              </label>
              <div className="relative">
                <input
                  {...register(`proofOfWork.${index}.url`)}
                  type="url"
                  id={`proofOfWork.${index}.url`}
                  className="w-full px-4 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none transition-colors text-base pr-8"
                  placeholder="https://github.com/yourname/project"
                  onBlur={(e) => handleUrlBlur(index, e.target.value)}
                />
                {urlValidation[index] && watch(`proofOfWork.${index}.url`) && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              {errors.proofOfWork?.[index] && typeof errors.proofOfWork[index] === 'object' && 'url' in errors.proofOfWork[index] && (
                <p className="mt-1 text-sm text-red-600">
                  {(errors.proofOfWork[index] as any).url?.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor={`proofOfWork.${index}.note`} className="block text-sm font-medium text-black mb-2 text-left">
                One-sentence note <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                {...register(`proofOfWork.${index}.note`)}
                id={`proofOfWork.${index}.note`}
                rows={2}
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none transition-colors text-base resize-none"
                placeholder="Brief description of what you built and your role..."
                maxLength={280}
              />
              <div className="flex items-center justify-between mt-1">
                {errors.proofOfWork?.[index] && typeof errors.proofOfWork[index] === 'object' && 'note' in errors.proofOfWork[index] && (
                  <p className="text-sm text-red-600">
                    {(errors.proofOfWork[index] as any).note?.message}
                  </p>
                )}
                <span className={`text-xs ${remainingChars < 0 ? 'text-red-500' : 'text-gray-500'} ml-auto`}>
                  {remainingChars} characters remaining
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {fields.length < 2 && (
        <button
          type="button"
          onClick={addAnotherEntry}
          className="w-full py-3 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          + Add another project
        </button>
      )}

      {errors.proofOfWork && typeof errors.proofOfWork.message === 'string' && (
        <p className="text-sm text-red-600">{errors.proofOfWork.message}</p>
      )}
    </div>
  );
}