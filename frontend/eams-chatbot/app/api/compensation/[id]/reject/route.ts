import { NextRequest } from "next/server";
import { forwardCompensation, readJsonBody } from "@/lib/server/compensationBff";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: unknown;
  if (request.body) {
    const parsed = await readJsonBody(request);
    if (parsed.error) return parsed.error;
    body = parsed.body;
  }
  return forwardCompensation(`/${encodeURIComponent(id)}/reject`, "PATCH", body);
}
