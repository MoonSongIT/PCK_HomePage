// 📁 파일 경로: app/(admin)/users/[id]/page.tsx

import { redirect } from "next/navigation";

export default function UserDetailPage() {
  redirect("/admin/users");
}
