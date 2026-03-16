// 📁 파일 경로: app/page.tsx
// 루트 페이지 → (public) 홈으로 리다이렉트

import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/");
}
