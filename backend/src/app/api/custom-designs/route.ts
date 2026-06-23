import { NextResponse } from "next/server";
import { db } from "../../../db";
import { customDesigns } from "../../../db/schema";
import { handleCors, withCors } from "../../../lib/cors";

export async function OPTIONS() {
  return handleCors();
}

export async function GET() {
  try {
    const list = await db.select().from(customDesigns);
    return withCors(NextResponse.json(list));
  } catch (err: any) {
    return withCors(
      NextResponse.json({ error: "Failed to fetch custom designs", details: err.message }, { status: 500 })
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, shape, color, texture, decor } = body;

    if (!id || !name || !shape || !color || !texture || !decor) {
      return withCors(
        NextResponse.json({ error: "Missing required custom design fields" }, { status: 400 })
      );
    }

    const newDesign = {
      id,
      name,
      shape,
      color,
      texture,
      decor,
      createdAt: new Date().toISOString(),
    };

    await db.insert(customDesigns).values(newDesign);

    return withCors(NextResponse.json(newDesign, { status: 201 }));
  } catch (err: any) {
    return withCors(
      NextResponse.json({ error: "Failed to save custom design", details: err.message }, { status: 500 })
    );
  }
}
