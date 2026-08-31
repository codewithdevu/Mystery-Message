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
      padding-bottom: 44px !important;
      overflow: visible !important;
    }
    .CardSwipeCarousel_Swiper .swiper-slide {
      border-radius: 1.25rem;
      overflow: hidden;
      box-shadow: 0 25px 35px -12px rgba(0, 0, 0, 0.85);
    }
    .CardSwipeCarousel_Swiper .swiper-pagination-bullet {
      background: #71717a !important;
      opacity: 0.4;
    }
    .CardSwipeCarousel_Swiper .swiper-pagination-bullet-active {
      background: #fafafa !important;
      opacity: 1;
      width: 20px;
      border-radius: 4px;
    }
  `;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={cn("relative w-full max-w-lg mx-auto flex flex-col items-center justify-center", className)}
    >
      <style>{customCss}</style>
      <Swiper
        effect="cards"
        grabCursor={true}
        loop={loop}
        autoplay={
          autoplay
            ? {
                delay: 3800,
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
        className="CardSwipeCarousel_Swiper h-[280px] w-[310px] sm:w-[380px] md:w-[410px]"
        modules={[EffectCards, Autoplay, Pagination, Navigation]}
      >
        {messages.map((message, index) => (
          <SwiperSlide key={index}>
            <div className="h-full w-full bg-zinc-900 border border-white/[0.08] p-7 sm:p-8 flex flex-col justify-between select-none relative">
              {/* Header Title */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <span className="text-[12px] font-mono tracking-wide text-zinc-400 font-medium">
                  {message.title}
                </span>
              </div>
              
              {/* Body Content with vertical centering & generous padding */}
              <div className="my-auto py-3">
                <p className="text-[14px] sm:text-[15px] text-zinc-200 font-medium leading-relaxed tracking-normal">
                  "{message.content}"
                </p>
              </div>

              {/* Bottom Footer metadata */}
              <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-3 border-t border-white/[0.06]">
                <span>Anonymous Message</span>
                <span className="font-mono text-zinc-600">Swipe →</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4 mt-1">
        <button
          className="swiper-button-prev-custom p-2.5 rounded-full bg-zinc-900 border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer disabled:opacity-30"
          aria-label="Previous card"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <button
          className="swiper-button-next-custom p-2.5 rounded-full bg-zinc-900 border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer disabled:opacity-30"
          aria-label="Next card"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};
