import type { ApplyWorkFromHomeRequest, WorkFromHomeRequest } from "@/types/workFromHome";

async function readResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(typeof body?.message === "string" ? body.message : "Work-from-home request failed");
  return body as T;
}

export async function applyWorkFromHome(request: ApplyWorkFromHomeRequest): Promise<WorkFromHomeRequest> {
  return readResponse(await fetch("/api/work-from-home", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(request),
  }));
}
