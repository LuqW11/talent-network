export type ReferralEvent = { 
  refToken: string; 
  deviceId: string; 
  ts: string; 
  utm?: Record<string, string> 
};

export const ReferralService = {
  ensureRefToken(): string {
    if (typeof window === 'undefined') return '';
    
    const existing = localStorage.getItem('tw_ref_token');
    if (existing) return existing;
    
    // Generate new token using crypto.getRandomValues for better randomness
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'tw_';
    const array = new Uint8Array(8);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < 8; i++) {
      result += chars[array[i]! % chars.length];
    }
    
    localStorage.setItem('tw_ref_token', result);
    return result;
  },

  getInviteLink(origin: string): string {
    const token = this.ensureRefToken();
    return `${origin}?ref=${token}`;
  },

  recordReferralEvent: async (event: ReferralEvent) => {
    // TODO: Firebase callable function
    // const recordReferral = httpsCallable(functions, 'recordReferral');
    // await recordReferral({
    //   refToken: event.refToken,
    //   deviceId: event.deviceId,
    //   timestamp: event.ts,
    //   utmParams: event.utm || {}
    // });
    console.log('TODO: Record referral event', event);
  },

  getReferralCount: async (refToken: string): Promise<number> => {
    // TODO: Firebase callable function for future polling
    // const getReferrals = httpsCallable(functions, 'getReferrals');
    // const result = await getReferrals({ refToken });
    // return result.data.count;
    console.log('TODO: Get referral count for', refToken);
    return 0;
  }
};