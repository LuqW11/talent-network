import { z } from "zod";

const mmYYYY = /^(0[1-9]|1[0-2])\/\d{4}$/; // basic MM/YYYY

export const step1Schema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.string().email("Please enter a valid email address"),
  linkedinUrl: z.string().url("Please enter a valid LinkedIn URL").optional().or(z.literal("")),
  gdprConsent: z.boolean().refine((val) => val === true, {
    message: "You must consent to data processing to continue"
  })
});

export const step2Schema = z.object({
  university: z.string().min(2, "University is required").max(200),
  gradYear: z.number().int().min(new Date().getFullYear()).max(new Date().getFullYear() + 3),
  cvMeta: z.object({
    name: z.string().min(1),
    size: z.number().max(5 * 1024 * 1024, 'File too large'),
    type: z.literal('application/pdf'),
    hash: z.string().min(10),
  }).nullable().optional(),

  // NEW FIELDS
  location: z.string()
    .min(3, "Please enter your city and country")
    .max(80, "Keep it short (City, Country)")
    .transform(s => s.trim().replace(/\s+/g, ' ')),
  rightToWork: z.enum(['rtw','sponsor','temporary'], {
    required_error: 'Select your current right to work status',
    invalid_type_error: 'Select your current right to work status',
  }),
  visaType: z.string().max(40).optional().or(z.literal("")),
  visaExpiry: z.string().regex(mmYYYY, 'Use MM/YYYY').optional().or(z.literal("")),
  githubUrl: z.string().url("Please enter a valid GitHub URL").optional().or(z.literal("")),
  proofOfWork: z.array(z.object({
    url: z.string().url('Enter a valid URL').optional().or(z.literal("")),
    note: z.string().max(280, 'Max 280 characters').optional().or(z.literal("")),
  })).max(2, 'You can add up to two items').optional(),
});

export const RoleLaneEnum = z.enum(['Backend SWE', 'ML Platform', 'Data Eng', 'Platform-SRE', 'Solutions Eng']);

export const StepInterestsSchema = z.object({
  domainInterests: z.array(z.string()).min(1, 'Pick at least one domain').max(3, 'Pick up to 3'),
  roleInterests: z.array(RoleLaneEnum).min(1, 'Select at least one role').max(3, 'Select up to 3'),
  skills: z.array(z.string().min(2).max(20)).max(10, 'Select up to 10'),
  dreamStartups: z.string().max(200).optional(),
});

export const fullFormSchema = step1Schema.merge(step2Schema).merge(StepInterestsSchema);

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type StepInterestsData = z.infer<typeof StepInterestsSchema>;
export type FullFormData = z.infer<typeof fullFormSchema>;

export const roleOptions = [
  "Backend SWE",
  "ML Platform", 
  "Data Eng",
  "Platform-SRE",
  "Solutions Eng"
] as const;

export type RoleOption = typeof roleOptions[number];

// Normaliser for TagSearch/skills
export const normaliseTech = (s: string) => s.trim()
  .replace(/\s+/g,' ')
  .replace(/^k8s$/i,'Kubernetes')
  .replace(/^tf$/i,'Terraform')
  .replace(/^js$/i,'JavaScript')
  .replace(/^ts$/i,'TypeScript')
  .replace(/^gke$/i,'Kubernetes')
  .replace(/^s3$/i,'AWS')
  .replace(/^gql$/i,'GraphQL')
  .replace(/^pgsql$/i,'PostgreSQL')
  .replace(/^py$/i,'Python');

// Migration: move legacy roleInterests (from Page 2) & laneTech -> new fields
export function migrateInterestsDraft(draft: any) {
  if (!draft) return draft;
  if (Array.isArray(draft.laneTech) && !draft.skills) {
    draft.skills = draft.laneTech;
    delete draft.laneTech;
  }
  if (draft.roleInterests && !Array.isArray(draft.roleInterests)) {
    draft.roleInterests = [draft.roleInterests].filter(Boolean);
  }
  return draft;
}