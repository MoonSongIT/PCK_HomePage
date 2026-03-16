// 📁 파일 경로: app/(public)/activities/[slug]/page.tsx

import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { ACTIVITY_CATEGORY_LABELS } from "@/types";
import type { ActivityCategory } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ActivityDetailPage({ params }: Props) {
  const { slug } = await params;

  const activity = await db.activity
    .findUnique({ where: { slug } })
    .catch(() => null);

  if (!activity || !activity.isPublished) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Badge variant="outline" className="mb-3">
          {ACTIVITY_CATEGORY_LABELS[activity.category as ActivityCategory]}
        </Badge>
        <h1 className="font-serif text-3xl font-bold text-[var(--color-text-primary)] md:text-4xl">
          {activity.title}
        </h1>
        <time className="mt-2 block text-sm text-[var(--color-text-secondary)]">
          {formatDate(activity.createdAt)}
        </time>
      </div>

      {activity.thumbnailUrl && (
        <div className="mb-8 aspect-video overflow-hidden rounded-lg bg-[var(--color-background)]">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${activity.thumbnailUrl})` }}
          />
        </div>
      )}

      <div className="prose prose-lg max-w-none text-[var(--color-text-primary)]">
        {activity.content.split("\n").map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
