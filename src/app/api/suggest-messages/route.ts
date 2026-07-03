import { generateText, APICallError } from 'ai';
import { openai } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Apka detailed aur clean prompt jo aapne image me banaya hai
    const promptString = 
      "Create a list of three open-ended and engaging questions formatted as a single string. " +
      "Each question should be separated by '||'. These questions are for an anonymous social messaging platform, " +
      "like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, " +
      "focusing instead on universal themes that encourage friendly interaction. For example, your output " +
      "should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with " +
      "any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the " +
      "questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: promptString,
    });
 
    return NextResponse.json({ text });

  } catch (error) {
    if (APICallError.isInstance(error)) {
      console.error("OpenAI API call failed:", error.statusCode, error.message);
      return NextResponse.json({ error: "OpenAI API Error" }, { status: error.statusCode });
    }
    
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}