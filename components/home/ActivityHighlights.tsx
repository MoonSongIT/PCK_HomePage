// 📁 파일 경로: components/home/ActivityHighlights.tsx

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { ACTIVITY_CATEGORY_LABELS } from "@/types";
import type { Activity } from "@/types";

interface ActivityHighlightsProps {
  activities: Activity[];
}

export default function ActivityHighlights({
  activities,
}: ActivityHighlightsProps) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-[var(--color-text-primary)] md:text-3xl">
            최근 활동
          </h2>
          <Button variant="link" asChild>
            <Link href="/activities" className="gap-1">
              전체 보기 <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

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
      </div>
    </section>
  );
}
