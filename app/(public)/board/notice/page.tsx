// 📁 파일 경로: app/(public)/board/notice/page.tsx

import PageHeader from "@/components/common/PageHeader";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

async function getNotices() {
  try {
    return await db.boardPost.findMany({
      where: { boardType: "notice" },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      take: 20,
    });
  } catch {
    return [];
  }
}

export default async function NoticePage() {
  const notices = await getNotices();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader title="공지사항" />

      {notices.length === 0 ? (
        <div className="py-16 text-center text-[var(--color-text-secondary)]">
          등록된 공지사항이 없습니다.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60%]">제목</TableHead>
              <TableHead>작성일</TableHead>
              <TableHead className="text-right">조회</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notices.map((notice) => (
              <TableRow key={notice.id}>
                <TableCell>
                  {notice.isPinned && (
                    <Badge variant="default" className="mr-2">
                      고정
                    </Badge>
                  )}
                  {notice.title}
                </TableCell>
                <TableCell>{formatDate(notice.createdAt)}</TableCell>
                <TableCell className="text-right">
                  {notice.viewCount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
