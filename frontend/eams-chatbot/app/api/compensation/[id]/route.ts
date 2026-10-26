import { forwardCompensation } from "@/lib/server/compensationBff";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return forwardCompensation(`/${encodeURIComponent(id)}`);
}
