import { forwardCompensation } from "@/lib/server/compensationBff";
export async function GET() { return forwardCompensation("/options"); }
