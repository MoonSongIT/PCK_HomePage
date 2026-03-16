// 📁 파일 경로: components/settings/ApiKeyCard.tsx
"use client";

import { useState } from "react";
import { Copy, Check, Pencil, Trash2, Key } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { ApiKeyConfig } from "@/types";

interface ApiKeyCardProps {
  apiKey: ApiKeyConfig;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ApiKeyCard({ apiKey, onEdit, onDelete }: ApiKeyCardProps) {
  const [copied, setCopied] = useState(false);

  const maskedValue = `${"•".repeat(16)}${apiKey.lastFourChars || "****"}`;

  const handleCopyIdentifier = async () => {
    await navigator.clipboard.writeText(apiKey.keyIdentifier);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary)]/10">
              <Key className="h-5 w-5 text-[var(--color-primary)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-text-primary)]">
                {apiKey.serviceName}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {apiKey.keyIdentifier}
              </p>
            </div>
          </div>
          <Badge variant={apiKey.isActive ? "success" : "outline"}>
            {apiKey.isActive ? "활성" : "비활성"}
          </Badge>
        </div>

        <div className="mt-4 rounded-md bg-[var(--color-background)] px-3 py-2 font-mono text-sm">
          {maskedValue}
        </div>

        {apiKey.description && (
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {apiKey.description}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
          <span>등록일: {formatDate(apiKey.createdAt)}</span>
          <span>수정일: {formatDate(apiKey.updatedAt)}</span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyIdentifier}
            className="gap-1"
          >
            {copied ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            복사
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(apiKey.id)}
            className="gap-1"
          >
            <Pencil className="h-3 w-3" />
            수정
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(apiKey.id)}
            className="gap-1 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10"
          >
            <Trash2 className="h-3 w-3" />
            삭제
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
