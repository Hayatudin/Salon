import { NextResponse } from "next/server";
import { handleCors, withCors } from "../../../lib/cors";

export async function OPTIONS() {
  return handleCors();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, history, outfitColors } = body;

    if (!message) {
      return withCors(
        NextResponse.json({ error: "Missing prompt message" }, { status: 400 })
      );
    }

    const lower = message.toLowerCase();
    let reply = "";

    if (outfitColors && outfitColors.length > 0) {
      reply = `I've analyzed your outfit colors (${outfitColors.join(", ")}). I highly recommend our "Rose Gold Elegance" design for a glowing accent, or "Classic French Tips" for timeless styling that won't compete with your dress. Let me know if you would like me to show these in the gallery!`;
    } else if (lower.includes("price") || lower.includes("cost") || lower.includes("how much")) {
      reply = "Our pricing ranges from $30 for a clean Nude Minimalist set up to $85 for a detailed Bridal Package. You can check the complete list in our Gallery details or on the Book Now page.";
    } else if (lower.includes("wedding") || lower.includes("marriage") || lower.includes("bridal")) {
      reply = "For weddings, we recommend our specialized 'Bridal Blush' or the elegant 'Rose Gold Elegance'. They feature beautiful shimmers and custom art details suitable for your special day.";
    } else if (lower.includes("dark") || lower.includes("black") || lower.includes("night")) {
      reply = "If you like deep colors, you must try 'Midnight Luxe'! It is a beautiful coffin shape in matte black with gold foil outlines. It's one of our trending styles.";
    } else if (lower.includes("skin") || lower.includes("tone") || lower.includes("suit")) {
      reply = "For warmer skin tones, gold shimmer or coral ombres ('Gel Ombre Sunset') look amazing. For cooler skin tones, we recommend deep berries or icy silvers like 'Acrylic Galaxy'. Nudes and classic french tips look gorgeous on all skin tones!";
    } else {
      reply = "Hello! I am your Hani Luxe Assistant. I can help recommend nail styles, colors that match your skin tone or outfit, and booking assistance. Try asking 'What suits a wedding dress?' or upload your outfit photo above!";
    }

    return withCors(NextResponse.json({ reply }));
  } catch (err: any) {
    return withCors(
      NextResponse.json({ error: "Failed to process chat request", details: err.message }, { status: 500 })
    );
  }
}
