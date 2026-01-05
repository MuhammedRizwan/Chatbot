import { getGeminiModel } from "@/config/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { message } = await req.json();
        const model = getGeminiModel();

        const systemPrompt = `
You are a friendly chatbot.
Be conversational, helpful, and positive.
Explain things simply. 
If unsure, say so kindly — don't make stuff up.
`;

        const result = await model.generateContent(`
${systemPrompt}

User: ${message}
Bot:
`);

        const response = result.response.text();

        return NextResponse.json({ reply: response });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}

