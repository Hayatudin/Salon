import { NextResponse } from "next/server";
import { db } from "../../../db";
import { testimonials } from "../../../db/schema";
import { handleCors, withCors } from "../../../lib/cors";

export async function OPTIONS() {
  return handleCors();
}

export async function GET() {
  try {
    const list = await db.select().from(testimonials);
    
    // Seed default reviews if none are present in DB
    if (list.length === 0) {
      const defaultReviews = [
        {
          id: "s1",
          name: "Sara M.",
          rating: 5,
          text: "Hani is a true artist! My acrylic extensions are perfect and lasted for weeks. The salon design is stunning.",
          service: "Acrylic Extensions",
          avatarUrl: "",
          createdAt: new Date().toISOString(),
        },
        {
          id: "s2",
          name: "Hanna T.",
          rating: 5,
          text: "The studio is beautiful, and the service is next-level. Best spa pedicure in Addis Ababa!",
          service: "Luxury Spa Pedicure",
          avatarUrl: "",
          createdAt: new Date().toISOString(),
        },
        {
          id: "s3",
          name: "Liya K.",
          rating: 4.8,
          text: "Loved the AI matching assistant and the final gel nail design was absolutely spot on.",
          service: "Gel Polish Manicure",
          avatarUrl: "",
          createdAt: new Date().toISOString(),
        },
      ];
      
      for (const rev of defaultReviews) {
        await db.insert(testimonials).values(rev);
      }
      return withCors(NextResponse.json(defaultReviews));
    }
    
    return withCors(NextResponse.json(list));
  } catch (err: any) {
    return withCors(
      NextResponse.json({ error: "Failed to fetch testimonials", details: err.message }, { status: 500 })
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, rating, text, service, avatarUrl } = body;

    if (!name || rating === undefined || !text || !service) {
      return withCors(
        NextResponse.json({ error: "Missing required testimonial fields" }, { status: 400 })
      );
    }

    const newTestimonial = {
      id: `rev-${Date.now()}`,
      name,
      rating: Number(rating),
      text,
      service,
      avatarUrl: avatarUrl || null,
      createdAt: new Date().toISOString(),
    };

    await db.insert(testimonials).values(newTestimonial);

    return withCors(NextResponse.json(newTestimonial, { status: 201 }));
  } catch (err: any) {
    return withCors(
      NextResponse.json({ error: "Failed to create testimonial", details: err.message }, { status: 500 })
    );
  }
}
