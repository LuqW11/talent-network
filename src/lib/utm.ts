export const pickParams = (sp: URLSearchParams, keys: string[]) =>
  keys.reduce((acc, k) => { const v = sp.get(k); if (v) acc[k]=v; return acc; }, {} as Record<string,string>);

export const preserveQuery = (to: string, fromSearch: URLSearchParams) => {
  const keep = ['ref','utm_source','utm_medium','utm_campaign','utm_term','utm_content'];
  const obj = pickParams(fromSearch, keep);
  const qs = new URLSearchParams(obj).toString();
  return qs ? `${to}?${qs}` : to;
};