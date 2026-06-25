import { NextResponse } from "next/server";
import { db } from "../../../db";
import { collections } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { handleCors, withCors } from "../../../lib/cors";

export async function OPTIONS() {
  return handleCors();
}

export async function GET() {
  try {
    const list = await db.select().from(collections);
    return withCors(NextResponse.json(list));
  } catch (err: any) {
    return withCors(
      NextResponse.json({ error: "Failed to fetch collections", details: err.message }, { status: 500 })
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, image } = body;

    if (!name || !image) {
      return withCors(
        NextResponse.json({ error: "Missing required fields: name, image" }, { status: 400 })
      );
    }

    const newCollection = {
      id: `coll-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name,
      image,
      createdAt: new Date().toISOString(),
    };

    await db.insert(collections).values(newCollection);
    return withCors(NextResponse.json(newCollection, { status: 201 }));
  } catch (err: any) {
    return withCors(
      NextResponse.json({ error: "Failed to create collection", details: err.message }, { status: 500 })
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const name = searchParams.get("name");

    if (!id && !name) {
      return withCors(
        NextResponse.json({ error: "Missing delete identifier: id or name" }, { status: 400 })
      );
    }

    if (id) {
      await db.delete(collections).where(eq(collections.id, id));
    } else if (name) {
      await db.delete(collections).where(eq(collections.name, name));
    }

    return withCors(NextResponse.json({ message: "Collection deleted successfully" }));
  } catch (err: any) {
    return withCors(
      NextResponse.json({ error: "Failed to delete collection", details: err.message }, { status: 500 })
    );
  }
}
