import { NextResponse } from "next/server";
import { db } from "../../../db";
import { appointments } from "../../../db/schema";
import { handleCors, withCors } from "../../../lib/cors";

export async function OPTIONS() {
  return handleCors();
}

export async function GET() {
  try {
    const list = await db.select().from(appointments);
    return withCors(NextResponse.json(list));
  } catch (err: any) {
    return withCors(
      NextResponse.json({ error: "Failed to fetch appointments", details: err.message }, { status: 500 })
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, service, artist, date, time, notes, customDesignId } = body;

    if (!name || !phone || !email || !service || !artist || !date || !time) {
      return withCors(
        NextResponse.json({ error: "Missing required booking fields" }, { status: 400 })
      );
    }

    const newAppointment = {
      id: `bk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name,
      phone,
      email,
      service,
      artist,
      date,
      time,
      notes: notes || null,
      customDesignId: customDesignId || null,
      createdAt: new Date().toISOString(),
    };

    await db.insert(appointments).values(newAppointment);

    return withCors(NextResponse.json(newAppointment, { status: 201 }));
  } catch (err: any) {
    return withCors(
      NextResponse.json({ error: "Failed to create appointment", details: err.message }, { status: 500 })
    );
  }
}
