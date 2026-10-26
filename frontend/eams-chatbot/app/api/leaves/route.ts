// app/api/leaves/route.ts
// POST here is how an Employee applies for leave (see lib/api/leaves.ts's
// applyLeave). GET isn't needed here — Server Component pages fetch leave
// lists directly via lib/server/leaves.ts, not through this route.

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8081";

// export async function POST(request: NextRequest) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

//   if (!token) {
//     return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
//   }

//   const body = await request.json();

//   const backendRes = await fetch(`${BACKEND_URL}/api/leaves`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(body),
//   });

//   const data = await backendRes.json().catch(() => null);

//   if (!backendRes.ok) {
//     return NextResponse.json(
//       { message: data?.message ?? "Failed to submit leave request" },
//       { status: backendRes.status }
//     );
//   }

//   return NextResponse.json(data);
// }
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const backendRes = await fetch(`${BACKEND_URL}/api/leaves`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const responseText = await backendRes.text();

    let data: unknown = null;

    try {
      data = responseText ? JSON.parse(responseText) : null;
    } catch {
      data = { message: responseText || "Empty response from backend" };
    }

    if (!backendRes.ok) {
      const message =
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof data.message === "string"
          ? data.message
          : "Failed to submit leave request";

      return NextResponse.json(
        { message },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Leave submission route failed:", error);

    return NextResponse.json(
      { message: "Unable to process leave request. Check server logs." },
      { status: 500 }
    );
  }
}
