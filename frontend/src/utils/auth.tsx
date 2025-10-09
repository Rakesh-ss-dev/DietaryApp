export type UserRole = 'user' | 'patient' | null;

export const getUserType = (): UserRole => {
  if (localStorage.getItem('user')) return 'user';
  if (localStorage.getItem('patient')) return 'patient';
  return null;
};
