// lib/waitlist-service.ts
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface WaitlistSubmission {
    // Step 1 - Basic Details
    firstName: string;
    lastName: string;
    email: string;
    linkedinUrl?: string | undefined;
    gdprConsent: boolean;
    
    // Step 2 - Education & Professional
    university: string;  // Required by form validation
    gradYear: number;    // Required by form validation
    location: string;    // Required by form validation
    rightToWork: string; // Required by form validation
    visaType?: string | undefined;
    visaExpiry?: string | undefined;
    githubUrl?: string | undefined;
    proofOfWork?: Array<{
      url?: string;
      note?: string;
    }> | undefined;
    
    // Step 3 - Interests & Skills
    domainInterests: string[];  // Required by form validation
    roleInterests: string[];    // Required by form validation
    skills: string[];           // Required by form validation
    dreamStartups?: string | undefined;
    
    // Metadata
    submittedAt?: any; // Firestore timestamp
    referralToken?: string | undefined;
    utmSource?: string | undefined;
    utmMedium?: string | undefined;
    utmCampaign?: string | undefined;
  }

  
export class WaitlistService {
  /**
   * Submit waitlist application to Firestore
   */
  static async submitApplication(data: WaitlistSubmission): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      // Get UTM parameters and referral from localStorage
      const utmSource = typeof window !== 'undefined' ? localStorage.getItem('utm_source') : null;
      const utmMedium = typeof window !== 'undefined' ? localStorage.getItem('utm_medium') : null;
      const utmCampaign = typeof window !== 'undefined' ? localStorage.getItem('utm_campaign') : null;
      const referralToken = typeof window !== 'undefined' ? localStorage.getItem('tw_ref_from') : null;
      
      const submission: WaitlistSubmission = {
        ...data,
        submittedAt: serverTimestamp(),
        ...(referralToken && { referralToken }),
        ...(utmSource && { utmSource }),
        ...(utmMedium && { utmMedium }),
        ...(utmCampaign && { utmCampaign }),
      };


      // Add to Firestore
      const docRef = await addDoc(collection(db, 'waitlist'), submission);
      
      console.log('Waitlist submission successful:', docRef.id);
      return { success: true, id: docRef.id };
      
    } catch (error) {
      console.error('Error submitting waitlist application:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An error occurred while submitting your application'
      };
    }
  }
}