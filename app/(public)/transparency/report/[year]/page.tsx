// 📁 파일 경로: app/(public)/transparency/report/[year]/page.tsx

import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ year: string }>;
}

export default async function ReportYearPage({ params }: Props) {
  const { year } = await params;
  redirect(`/transparency?year=${year}`);
}
