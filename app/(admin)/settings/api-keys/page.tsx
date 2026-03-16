// 📁 파일 경로: app/(admin)/settings/api-keys/page.tsx
"use client";

import { useState } from "react";
import { Plus, Key } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import ApiKeyCard from "@/components/settings/ApiKeyCard";
import ApiKeyForm from "@/components/settings/ApiKeyForm";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import {
  useApiKeys,
  useCreateApiKey,
  useUpdateApiKey,
  useDeleteApiKey,
} from "@/hooks/useApiKeys";
import type { ApiKeyCreateInput } from "@/lib/validations/api-key.schema";
import type { ApiKeyConfig } from "@/types";

export default function ApiKeysPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<(ApiKeyConfig & { lastFourChars?: string }) | null>(null);

  const { data: result, isLoading } = useApiKeys();
  const createMutation = useCreateApiKey();
  const updateMutation = useUpdateApiKey();
  const deleteMutation = useDeleteApiKey();

  const apiKeys = result?.data || [];

  const handleCreate = async (data: ApiKeyCreateInput) => {
    await createMutation.mutateAsync(data);
  };

  const handleUpdate = async (data: ApiKeyCreateInput) => {
    if (!editData) return;
    await updateMutation.mutateAsync({ id: editData.id, data });
    setEditData(null);
  };

  const handleEdit = (id: string) => {
    const key = apiKeys.find((k) => k.id === id);
    if (key) {
      setEditData(key);
      setFormOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말로 이 API Key를 삭제하시겠습니까?")) return;
    await deleteMutation.mutateAsync(id);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditData(null);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="API 키 관리"
        description="AI 도구 및 외부 서비스의 API 키를 안전하게 관리합니다."
      >
        <Button onClick={() => setFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />새 API 키 등록
        </Button>
      </PageHeader>

      {apiKeys.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
          <Key className="h-12 w-12 text-[var(--color-text-secondary)] opacity-50" />
          <p className="text-[var(--color-text-secondary)]">
            등록된 API 키가 없습니다.
          </p>
          <Button onClick={() => setFormOpen(true)}>
            첫 API 키 등록하기
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {apiKeys.map((apiKey) => (
            <ApiKeyCard
              key={apiKey.id}
              apiKey={apiKey}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <ApiKeyForm
        open={formOpen}
        onOpenChange={handleFormClose}
        onSubmit={editData ? handleUpdate : handleCreate}
        editData={
          editData
            ? {
                id: editData.id,
                serviceName: editData.serviceName,
                keyIdentifier: editData.keyIdentifier,
                description: editData.description,
                isActive: editData.isActive,
                lastFourChars: editData.lastFourChars,
              }
            : null
        }
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
