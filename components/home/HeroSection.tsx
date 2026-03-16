// 📁 파일 경로: components/home/HeroSection.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const SLIDES = [
  {
    title: "그리스도의 평화가\n세상에",
    subtitle: "Pax Christi — 평화를 위한 기도와 행동",
    bg: "from-[var(--color-primary)] to-[var(--color-primary)]/80",
  },
  {
    title: "정의와 평화,\n화해의 길",
    subtitle: "가톨릭 국제 평화운동 한국 지부",
    bg: "from-[var(--color-secondary)] to-[var(--color-secondary)]/80",
  },
  {
    title: "함께 만드는\n평화로운 세상",
    subtitle: "50개국과 함께하는 국제 연대",
    bg: "from-[var(--color-primary)]/90 to-[var(--color-secondary)]/80",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative flex min-h-[600px] items-center overflow-hidden lg:min-h-[80vh]">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className={`absolute inset-0 bg-gradient-to-br ${SLIDES[current].bg}`}
        />
      </AnimatePresence>

      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="whitespace-pre-line font-serif text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              {SLIDES[current].title}
            </h1>
            <p className="mt-4 text-lg text-white/90 md:text-xl">
              {SLIDES[current].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" variant="accent" asChild>
            <Link href="/about">단체 소개</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10"
            asChild
          >
            <Link href="/donation">후원하기</Link>
          </Button>
        </div>

        {/* 슬라이드 인디케이터 */}
        <div className="mt-8 flex justify-center gap-2">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all ${
                index === current
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
