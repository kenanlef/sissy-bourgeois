import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();
    if (!String(email || "").includes("@")) return NextResponse.json({error:"Enter a valid email."},{status:400});
    await prisma.subscriber.upsert({
      where:{email:String(email).trim().toLowerCase()},
      update:{name:String(name||"").trim()},
      create:{email:String(email).trim().toLowerCase(), name:String(name||"").trim()}
    });
    return NextResponse.json({ok:true, code:"WELCOME10"});
  } catch(e) { return NextResponse.json({error:e instanceof Error?e.message:"Could not subscribe."},{status:400}); }
}
