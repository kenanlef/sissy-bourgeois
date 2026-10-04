import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "Admin credentials are not configured." },
        { status: 500 }
      );
    }

    const validEmail =
      String(email).toLowerCase().trim() === adminEmail.toLowerCase().trim();

    const validPassword =
      adminPassword.startsWith("$2a$") ||
      adminPassword.startsWith("$2b$") ||
      adminPassword.startsWith("$2y$")
        ? await bcrypt.compare(String(password), adminPassword)
        : String(password) === adminPassword;

    if (!validEmail || !validPassword) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    await createAdminSession();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      { error: "Login failed." },
      { status: 500 }
    );
  }
}