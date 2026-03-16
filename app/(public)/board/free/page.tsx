// 📁 파일 경로: app/(public)/board/free/page.tsx

import PageHeader from "@/components/common/PageHeader";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

async function getFreePosts() {
  try {
    return await db.boardPost.findMany({
      where: { boardType: "free" },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  } catch {
    return [];
  }
}

export default async function FreeBoardPage() {
  const posts = await getFreePosts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader title="자유게시판" />

      {posts.length === 0 ? (
        <div className="py-16 text-center text-[var(--color-text-secondary)]">
          등록된 게시글이 없습니다.
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
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.title}</TableCell>
                <TableCell>{formatDate(post.createdAt)}</TableCell>
                <TableCell className="text-right">
                  {post.viewCount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
