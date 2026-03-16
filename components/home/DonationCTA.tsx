// 📁 파일 경로: components/home/DonationCTA.tsx

import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const DONATION_AMOUNTS = [10000, 30000, 50000, 100000];

export default function DonationCTA() {
  return (
    <section className="bg-[var(--color-primary)] py-16 text-white">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <Heart className="mx-auto h-10 w-10 text-[var(--color-accent)]" />
        <h2 className="mt-4 font-serif text-2xl font-bold md:text-3xl">
          평화를 위한 후원에 동참해 주세요
        </h2>
        <p className="mt-3 text-lg text-white/80">
          여러분의 소중한 후원이 평화의 씨앗이 됩니다
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {DONATION_AMOUNTS.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              className="border-white/50 text-white hover:bg-white/10"
              asChild
            >
              <Link href={`/donation?amount=${amount}`}>
                {amount.toLocaleString()}원
              </Link>
            </Button>
          ))}
        </div>

        <Button size="lg" variant="accent" className="mt-6" asChild>
          <Link href="/donation">후원하기</Link>
        </Button>
      </div>
    </section>
  );
}
