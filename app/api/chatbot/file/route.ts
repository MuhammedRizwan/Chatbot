import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/config/gemini";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const model = getGeminiModel();

    const result = await model.generateContent([
      {
        inlineData: {
          data: buffer.toString("base64"),
          mimeType: file.type,
        },
      },
      "Explain clearly what this file contains."
    ]);

    const reply = result.response.text();

    return NextResponse.json({ reply });

  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "File processing failed" },
      { status: 500 }
    );
  }
}
