"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import messages from "@/messages.json";
import Autoplay from "embla-carousel-autoplay";

const Home = () => {
  return (
    <>
      <main className="grow flex flex-col items-center justify-center px-4 md:px-24 py-20">
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
        <Carousel
          plugins={[Autoplay({ delay: 3000 })]}
          className="w-full max-w-sm"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card className="bg-zinc-900 border-white/[0.08]">
                    <CardHeader className="text-[13px] font-medium text-zinc-400 pb-2">
                      {message.title}
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      <span className="text-[14px] text-zinc-300 leading-relaxed">
                        {message.content}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>
      <footer className="text-center py-6 text-[13px] text-zinc-600 border-t border-white/[0.06]">
        © 2026 Mystery Message
      </footer>
    </>
  );
};

export default Home;
