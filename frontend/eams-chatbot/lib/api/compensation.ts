import type { CompensationOptions, CompensationRequest, SubmitCompensationRequest } from "@/types/compensation";

async function parse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message = typeof body?.message === "string" ? body.message : "Compensation request failed";
    throw new Error(message);
  }
  return body as T;
}

export async function getCompensationOptions() {
  return parse<CompensationOptions>(await fetch("/api/compensation/options", { cache: "no-store" }));
}
export async function getMyCompensationRequests() {
  return parse<CompensationRequest[]>(await fetch("/api/compensation", { cache: "no-store" }));
}
export async function submitCompensationRequest(request: SubmitCompensationRequest) {
  return parse<CompensationRequest>(await fetch("/api/compensation", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(request),
  }));
}
