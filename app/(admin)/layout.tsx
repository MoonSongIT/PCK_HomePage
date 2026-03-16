// 📁 파일 경로: app/(admin)/layout.tsx
// 관리자 레이아웃 — CSR (보안 민감, 캐시 불필요)

import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-[var(--color-background)] p-6">
        {children}
      </main>
    </div>
  );
}
