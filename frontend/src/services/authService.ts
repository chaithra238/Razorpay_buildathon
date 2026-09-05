const AUTH_KEY = "recoverai-authenticated";
const BUSINESS_NAME_KEY = "recoverai-business-name";
export const AUTH_CHANGE_EVENT = "recoverai-auth-change";

export function isAuthenticated(): boolean {
  return window.localStorage.getItem(AUTH_KEY) === "true";
}

export function signIn(businessName?: string): void {
  const normalizedName = businessName?.trim();

  if (normalizedName) {
    window.localStorage.setItem(BUSINESS_NAME_KEY, normalizedName);
  }

  window.localStorage.setItem(AUTH_KEY, "true");
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function getBusinessName(): string {
  return window.localStorage.getItem(BUSINESS_NAME_KEY) || "Your Business";
}

export function signOut(): void {
  window.localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}
