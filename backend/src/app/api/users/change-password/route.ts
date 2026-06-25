import { NextResponse } from "next/server";
import { db } from "../../../../db";
import { users } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { handleCors, withCors } from "../../../../lib/cors";

export async function OPTIONS() {
  return handleCors();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, currentPassword, newPassword } = body;

    if (!email || !currentPassword || !newPassword) {
      return withCors(
        NextResponse.json({ error: "Missing required fields: email, currentPassword, newPassword" }, { status: 400 })
      );
    }

    // Retrieve user from database
    const userList = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (userList.length === 0) {
      return withCors(
        NextResponse.json({ error: "User not found" }, { status: 404 })
      );
    }

    const user = userList[0];

    // Check if the current password matches
    if (user.password !== currentPassword) {
      return withCors(
        NextResponse.json({ error: "Incorrect current password" }, { status: 401 })
      );
    }

    // Update the password in database
    await db.update(users).set({ password: newPassword }).where(eq(users.email, email));

    return withCors(
      NextResponse.json({ message: "Password updated successfully" }, { status: 200 })
    );
  } catch (err: any) {
    return withCors(
      NextResponse.json({ error: "Failed to update password", details: err.message }, { status: 500 })
    );
  }
}
