import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const questionPool = [
      // Set 1-5 (Casual & Fun)
      "What's a movie you can watch on repeat?||If you could instantly learn any skill, what would it be?||What is your absolute favorite comfort food?",
      "What's the most beautiful place you've ever visited?||If you won the lottery, what's the first thing you'd buy?||What's a hot take you completely agree with?",
      "What's your favorite way to spend a rainy day?||Cats or dogs, and what's your reasoning?||What's a skill you think everyone should learn?",
      "What's the best piece of advice you've ever received?||If you could travel anywhere in time, where would you go?||What's a hobby you want to start this year?",
      "What's a song that always puts you in a good mood?||If you could open a restaurant, what kind of food would you serve?||What's your biggest pet peeve?",

      // Set 6-10 (Lifestyle & Preferences)
      "Are you an early bird or a night owl?||What's the coolest thing you've ever bought from a thrift store?||What's a book that changed your perspective?",
      "If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?||What's your go-to weekend activity?",
      "What's the most adventurous thing you've ever done?||If you could speak any language fluently, which one would it be?||What's a secret talent you have?",
      "What's the best concert or event you've ever attended?||If you could only eat one cuisine for the rest of your life, what is it?||What's a custom or tradition you love?",
      "What's your favorite childhood memory?||If you could trade lives with someone for a day, who would it be?||What's something you're looking forward to this month?",

      // Set 11-15 (Deep & Thoughtful)
      "What does success look like to you?||If you could change one thing about the world, what would it be?||What is a core memory that defines who you are today?",
      "What is a fear you've recently overcome?||Do you believe everything happens for a reason?||What is the most valuable lesson a failure taught you?",
      "If you could send a short message to your future self, what would it be?||What does true happiness mean to you?||What is something you take for granted that you shouldn't?",
      "How do you handle stress or burnouts?||What is the most meaningful gift you've ever given or received?||What is a belief you held strongly that has now completely changed?",
      "What is something you want to be remembered for?||If you had the power to fix one social issue, what would it be?||What does loyalty mean in a friendship?",

      // Set 16-17 (Work, Tech & Pop-Culture)
      "What's your dream job if money didn't matter?||Remote work or office work, and why?||What's the most useful tech gadget you own?",
      "If you could live inside any video game or movie universe, which one would it be?||What's a trend that you wish would just go away?||What's the last show you completely binge-watched?"
    ];

    // Pick a random set from the pool
    const randomSet = questionPool[Math.floor(Math.random() * questionPool.length)];

    return NextResponse.json({ text: randomSet });

  } catch (error) {
    console.error("Local fallback failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}