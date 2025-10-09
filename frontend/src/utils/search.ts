export function filterRequests<T extends Record<string, any>>(
  data: T[],
  term: string,
  keys: (keyof T)[]
): T[] {
  if (!term.trim()) return data;
  const lowerTerm = term.toLowerCase();
  return data.filter((item) =>
    keys.some((key) => item[key]?.toString().toLowerCase().includes(lowerTerm))
  );
}