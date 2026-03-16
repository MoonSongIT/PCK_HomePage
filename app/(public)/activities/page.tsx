// 📁 파일 경로: app/(public)/activities/page.tsx

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/common/PageHeader";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { ACTIVITY_CATEGORY_LABELS } from "@/types";
import type { Activity } from "@/types";

async function getActivities(): Promise<Activity[]> {
  try {
    const activities = await db.activity.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return activities as unknown as Activity[];
  } catch {
    return [];
  }
}

export default async function ActivitiesPage() {
  const activities = await getActivities();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        title="활동 소식"
        description="팍스 크리스티 코리아의 평화 활동 소식을 전합니다."
      />

      {activities.length === 0 ? (
        <div className="py-16 text-center text-[var(--color-text-secondary)]">
          아직 등록된 활동이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => (
            <Link key={activity.id} href={`/activities/${activity.slug}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                {activity.thumbnailUrl && (
                  <div className="aspect-video overflow-hidden rounded-t-lg bg-[var(--color-background)]">
                    <div
                      className="h-full w-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${activity.thumbnailUrl})`,
                      }}
                    />
                  </div>
                )}
                <CardContent className="p-4">
                  <Badge variant="outline" className="mb-2">
                    {ACTIVITY_CATEGORY_LABELS[activity.category]}
                  </Badge>
                  <h3 className="mb-2 line-clamp-2 font-semibold text-[var(--color-text-primary)]">
                    {activity.title}
                  </h3>
                  <p className="mb-3 line-clamp-2 text-sm text-[var(--color-text-secondary)]">
                    {activity.summary}
                  </p>
                  <time className="text-xs text-[var(--color-text-secondary)]">
                    {formatDate(activity.createdAt)}
                  </time>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
