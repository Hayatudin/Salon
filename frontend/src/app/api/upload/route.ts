import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get public/uploads path
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Create directory if not exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Create unique filename
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${Date.now()}_${sanitizedName}`;
    const filePath = path.join(uploadDir, filename);

    // Write to file system
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ 
      success: true, 
      filePath: `/uploads/${filename}` 
    });
  } catch (error: any) {
    console.error("File upload error in route handler:", error);
    return NextResponse.json({ error: error.message || "Failed to save file" }, { status: 500 });
  }
}
