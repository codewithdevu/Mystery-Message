"use client";

import * as React from "react";
import messages from "@/messages.json";
import { CardSwipeCarousel } from "@/components/CardSwipeCarousel";

const Home = () => {
  return (
    <>
      <main className="grow flex flex-col items-center justify-center px-4 md:px-24 py-16 md:py-24">
        <section className="text-center mb-10 md:mb-14 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-zinc-50 leading-tight">
            Anonymous conversations,
            <br />
            <span className="text-zinc-500">without the identity.</span>
          </h1>
          <p className="mt-4 md:mt-5 text-[15px] md:text-base text-zinc-500 max-w-md mx-auto leading-relaxed">
            Share your unique link. Receive honest, anonymous messages from anyone.
          </p>
        </section>

        {/* Skiper UI Card Swipe Carousel */}
        <CardSwipeCarousel messages={messages} />
      </main>
      
      <footer className="text-center py-6 text-[13px] text-zinc-600 border-t border-white/5">
        © 2026 Mystery Message
      </footer>
    </>
  );
};

export default Home;
