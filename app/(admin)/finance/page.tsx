// 📁 파일 경로: app/(admin)/finance/page.tsx

import { redirect } from "next/navigation";

export default function FinancePage() {
  redirect("/admin/dashboard");
}
