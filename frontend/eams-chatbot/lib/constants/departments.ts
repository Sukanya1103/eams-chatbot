export const DEPARTMENTS = [
  "Engineering",
  "AI & Data",
  "Product & Design",
  "Cybersecurity",
  "Blockchain & Web3",
  "IT & Operations",
  "Operations",
  "Sales & Marketing",
  "Customer Support & Customer Success",
  "Human Resources",
  "Finance",
] as const;

const LEGACY_DEPARTMENTS: Record<string, string> = {
  btech: "Engineering",
  developer: "Engineering",
  it: "IT & Operations",
  operational: "Operations",
};

export function normalizeDepartment(value: string | null | undefined): string {
  const department = value?.trim();
  if (!department) return "";

  const legacy = LEGACY_DEPARTMENTS[department.toLowerCase()];
  if (legacy) return legacy;

  return DEPARTMENTS.find((option) => option.toLowerCase() === department.toLowerCase()) ?? department;
}
