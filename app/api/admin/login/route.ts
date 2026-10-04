import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return NextResponse.json({ error: "Admin credentials are not configured." }, { status: 500 });
  }

  const validEmail = String(email).toLowerCase() === adminEmail.toLowerCase();
  const validPassword =
    adminPassword.startsWith("$2a$") || adminPassword.startsWith("$2b$")
      ? await bcrypt.compare(String(password), adminPassword)
      : String(password) === adminPassword;

  if (!validEmail || !validPassword) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  await createAdminSession();
  return NextResponse.json({ ok: true });
}
