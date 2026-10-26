/** Return the session's display name, never its email, for employee UI. */
export function employeeDisplayName(name: string | null | undefined): string | null {
  const value = name?.trim();
  if (!value || value.includes("@")) return null;
  return value;
}
