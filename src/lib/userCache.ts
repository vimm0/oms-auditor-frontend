const STORAGE_KEY = 'oms_auditor_user';

export interface CachedUser {
  user_name: string;
  right: string;
  user_id?: number;
}

export function getCachedUser(): CachedUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as CachedUser;
    return data && typeof data.user_name === 'string' ? data : null;
  } catch {
    return null;
  }
}

export function setCachedUser(user: CachedUser): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
}

export function clearCachedUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
