import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkStockPassword, stockSessionCookie } from "@/lib/stockAuth";

export async function POST(request: NextRequest) {
  const { password } = await request.json().catch(() => ({ password: "" }));

  if (typeof password !== "string" || !checkStockPassword(password)) {
    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
  }

  const cookieStore = await cookies();
  const cookie = stockSessionCookie();
  cookieStore.set(cookie.name, cookie.value, cookie);

  return NextResponse.json({ ok: true });
}
