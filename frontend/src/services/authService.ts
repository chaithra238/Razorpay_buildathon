const AUTH_KEY = "recoverai-authenticated";
export const AUTH_CHANGE_EVENT = "recoverai-auth-change";

export function isAuthenticated(): boolean {
  return window.localStorage.getItem(AUTH_KEY) === "true";
}

export function signIn(): void {
  window.localStorage.setItem(AUTH_KEY, "true");
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function signOut(): void {
  window.localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}
