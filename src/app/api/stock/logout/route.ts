import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { STOCK_COOKIE_NAME } from "@/lib/stockAuth";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(STOCK_COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
