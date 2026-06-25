import { NextResponse } from "next/server";
import { db } from "../../../db";
import { designs } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { handleCors, withCors } from "../../../lib/cors";

export async function OPTIONS() {
  return handleCors();
}

export async function GET() {
  try {
    const list = await db.select().from(designs);
    return withCors(NextResponse.json(list));
  } catch (err: any) {
    return withCors(
      NextResponse.json({ error: "Failed to fetch designs", details: err.message }, { status: 500 })
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      nameKey, 
      defaultName, 
      price, 
      duration, 
      shape, 
      type, 
      colors, 
      image, 
      tags, 
      collectionId 
    } = body;

    if (!defaultName || price === undefined || !image) {
      return withCors(
        NextResponse.json({ error: "Missing required fields: defaultName, price, image" }, { status: 400 })
      );
    }

    const newDesign = {
      id: `design-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      nameKey: nameKey || defaultName.toLowerCase().replace(/\s+/g, "-"),
      defaultName,
      price: Number(price),
      duration: duration !== undefined ? Number(duration) : 60,
      shape: shape || "Almond",
      type: type || "Gel",
      rating: 5.0,
      reviewsCount: 1,
      colors: Array.isArray(colors) ? colors.join(",") : (colors || ""),
      image,
      tags: Array.isArray(tags) ? tags.join(",") : (tags || ""),
      collectionId: collectionId || null,
      createdAt: new Date().toISOString(),
    };

    await db.insert(designs).values(newDesign);
    return withCors(NextResponse.json(newDesign, { status: 201 }));
  } catch (err: any) {
    return withCors(
      NextResponse.json({ error: "Failed to create design", details: err.message }, { status: 500 })
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return withCors(
        NextResponse.json({ error: "Missing design id parameter" }, { status: 400 })
      );
    }

    const body = await request.json();
    const updateData: any = {};
    
    if (body.defaultName !== undefined) updateData.defaultName = body.defaultName;
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.duration !== undefined) updateData.duration = Number(body.duration);
    if (body.shape !== undefined) updateData.shape = body.shape;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.collectionId !== undefined) updateData.collectionId = body.collectionId;
    if (body.colors !== undefined) {
      updateData.colors = Array.isArray(body.colors) ? body.colors.join(",") : body.colors;
    }
    if (body.tags !== undefined) {
      updateData.tags = Array.isArray(body.tags) ? body.tags.join(",") : body.tags;
    }

    await db.update(designs).set(updateData).where(eq(designs.id, id));
    
    const updated = await db.select().from(designs).where(eq(designs.id, id)).limit(1);
    return withCors(NextResponse.json(updated[0] || null));
  } catch (err: any) {
    return withCors(
      NextResponse.json({ error: "Failed to update design", details: err.message }, { status: 500 })
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return withCors(
        NextResponse.json({ error: "Missing design id parameter" }, { status: 400 })
      );
    }

    await db.delete(designs).where(eq(designs.id, id));
    return withCors(NextResponse.json({ message: "Design deleted successfully" }));
  } catch (err: any) {
    return withCors(
      NextResponse.json({ error: "Failed to delete design", details: err.message }, { status: 500 })
    );
  }
}
