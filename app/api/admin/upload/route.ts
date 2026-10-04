import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  if (!file.type.startsWith("image/")) return NextResponse.json({ error: "Only images are allowed." }, { status: 400 });
  if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: "Image must be smaller than 8MB." }, { status: 400 });
  const ext = (file.name.split(".").pop() || "jpg").replace(/[^a-z0-9]/gi, "").toLowerCase();
  const filename = `${Date.now()}-${crypto.randomBytes(5).toString("hex")}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/uploads/${filename}` });
}
