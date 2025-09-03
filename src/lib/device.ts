export function getDeviceId(): string {
  if (typeof window === 'undefined') return '';
  
  const existing = localStorage.getItem('tw_device_id');
  if (existing) return existing;
  
  // Generate UUID v4
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  
  localStorage.setItem('tw_device_id', uuid);
  return uuid;
}