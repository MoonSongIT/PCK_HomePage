// 📁 파일 경로: components/home/PeaceMessage.tsx

import { Quote } from "lucide-react";

export default function PeaceMessage() {
  const currentYear = new Date().getFullYear();

  return (
    <section className="bg-[var(--color-background)] py-16">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <Quote className="mx-auto h-10 w-10 text-[var(--color-accent)]" />
        <blockquote className="mt-6 font-serif text-xl leading-relaxed text-[var(--color-text-primary)] md:text-2xl">
          &ldquo;평화는 단순히 전쟁이 없는 것이 아니라, 정의의 결실입니다.&rdquo;
        </blockquote>
        <p className="mt-4 text-[var(--color-text-secondary)]">
          — {currentYear}년 세계 평화의 날 담화에서
        </p>
      </div>
    </section>
  );
}
