import { NextRequest } from "next/server";
import { forwardCompensation, readJsonBody } from "@/lib/server/compensationBff";

export async function GET() { return forwardCompensation("/my-requests"); }
export async function POST(request: NextRequest) {
  const parsed = await readJsonBody(request);
  if (parsed.error) return parsed.error;
  return forwardCompensation("", "POST", parsed.body);
}
