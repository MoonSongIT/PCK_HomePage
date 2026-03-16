// 📁 파일 경로: components/layout/Footer.tsx

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* 단체 정보 */}
          <div className="md:col-span-2">
            <h3 className="font-serif text-lg font-bold text-[var(--color-primary)]">
              PAX CHRISTI KOREA
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              팍스 크리스티 코리아는 가톨릭 국제 평화운동 한국 지부로서,
              그리스도의 평화를 세상에 전하기 위해 활동합니다.
            </p>
            <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
              이메일: contact@paxchristikorea.org
            </p>
          </div>

          {/* 바로가기 */}
          <div>
            <h4 className="font-medium text-[var(--color-text-primary)]">
              바로가기
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
                >
                  단체 소개
                </Link>
              </li>
              <li>
                <Link
                  href="/activities"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
                >
                  활동 소식
                </Link>
              </li>
              <li>
                <Link
                  href="/transparency"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
                >
                  투명성 공개
                </Link>
              </li>
              <li>
                <Link
                  href="/donation"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
                >
                  후원하기
                </Link>
              </li>
            </ul>
          </div>

          {/* 정책 */}
          <div>
            <h4 className="font-medium text-[var(--color-text-primary)]">
              정책
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <span className="text-[var(--color-text-secondary)]">
                  개인정보 처리방침
                </span>
              </li>
              <li>
                <span className="text-[var(--color-text-secondary)]">
                  이용약관
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--color-border)] pt-8 text-center text-sm text-[var(--color-text-secondary)]">
          <p>
            &copy; {currentYear} Pax Christi Korea. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
