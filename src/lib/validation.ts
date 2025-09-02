import { z } from "zod";

export const step1Schema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.string().email("Please enter a valid email address"),
  gdprConsent: z.boolean().refine((val) => val === true, {
    message: "You must consent to data processing to continue"
  })
});

export const step2Schema = z.object({
  university: z.string().min(2, "University is required").max(200),
  gradYear: z.number().int().min(new Date().getFullYear()).max(new Date().getFullYear() + 3),
  roleInterests: z.array(z.string()).min(1, "Please select at least one role interest"),
  linkedinUrl: z.string().url("Please enter a valid LinkedIn URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Please enter a valid GitHub/Portfolio URL").optional().or(z.literal(""))
});

export const fullFormSchema = step1Schema.merge(step2Schema);

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type FullFormData = z.infer<typeof fullFormSchema>;

export const roleOptions = [
  "Backend SWE",
  "ML Platform", 
  "Data Eng",
  "Platform-SRE",
  "Solutions"
] as const;

export type RoleOption = typeof roleOptions[number];