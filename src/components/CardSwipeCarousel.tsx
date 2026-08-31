"use client";

import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import { Autoplay, EffectCards, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css";
import { cn } from "@/lib/utils";

interface MessageItem {
  title: string;
  content: string;
  received?: boolean;
}

interface CardSwipeCarouselProps {
  messages: MessageItem[];
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
}

export const CardSwipeCarousel = ({
  messages,
  className,
  autoplay = true,
  loop = true,
}: CardSwipeCarouselProps) => {
  const customCss = `
    .CardSwipeCarousel_Swiper {
      padding-bottom: 40px !important;
      overflow: visible !important;
    }
    .CardSwipeCarousel_Swiper .swiper-slide {
      border-radius: 1.25rem;
      overflow: hidden;
      box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.7);
    }
    .CardSwipeCarousel_Swiper .swiper-pagination-bullet {
      background: #71717a !important;
      opacity: 0.5;
    }
    .CardSwipeCarousel_Swiper .swiper-pagination-bullet-active {
      background: #fafafa !important;
      opacity: 1;
      width: 18px;
      border-radius: 4px;
    }
  `;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={cn("relative w-full max-w-md mx-auto flex flex-col items-center justify-center", className)}
    >
      <style>{customCss}</style>
      <Swiper
        effect="cards"
        grabCursor={true}
        loop={loop}
        autoplay={
          autoplay
            ? {
                delay: 3500,
                disableOnInteraction: false,
              }
            : false
        }
        pagination={{
          clickable: true,
        }}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        className="CardSwipeCarousel_Swiper h-[240px] w-[300px] sm:w-[340px]"
        modules={[EffectCards, Autoplay, Pagination, Navigation]}
      >
        {messages.map((message, index) => (
          <SwiperSlide key={index}>
            <div className="h-full w-full bg-zinc-900 border border-white/10 p-6 flex flex-col justify-between select-none relative overflow-hidden backdrop-blur-xl">
              {/* Card Subtle Top Line Accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-zinc-400/40 to-transparent" />
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono tracking-wider text-zinc-500 uppercase font-semibold">
                    {message.title}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500/80 animate-pulse" />
                </div>
                <p className="text-[14px] sm:text-[15px] font-medium text-zinc-200 leading-relaxed">
                  "{message.content}"
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-500 border-t border-white/5 pt-3 mt-2">
                <span>Anonymous Signal</span>
                <span className="font-mono text-zinc-600">Swipe →</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Arrow Controls */}
      <div className="flex items-center justify-center gap-4 mt-2">
        <button
          className="swiper-button-prev-custom p-2 rounded-full bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer disabled:opacity-30"
          aria-label="Previous card"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <button
          className="swiper-button-next-custom p-2 rounded-full bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer disabled:opacity-30"
          aria-label="Next card"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};
