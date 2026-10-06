import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import crypto from "crypto";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No file uploaded." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only images are allowed." },
        { status: 400 }
      );
    }

    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be smaller than 8MB." },
        { status: 400 }
      );
    }

    const ext = (file.name.split(".").pop() || "jpg")
      .replace(/[^a-z0-9]/gi, "")
      .toLowerCase();

    const filename = `products/${Date.now()}-${crypto
      .randomBytes(5)
      .toString("hex")}.${ext}`;

    const blob = await put(filename, file, {
      access: "public",
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Upload failed.",
      },
      { status: 500 }
    );
  }
}
