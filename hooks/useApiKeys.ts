// 📁 파일 경로: hooks/useApiKeys.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listApiKeys,
  createApiKey,
  updateApiKey,
  deleteApiKey,
} from "@/server/actions/api-key.actions";
import type { ApiKeyCreateInput } from "@/lib/validations/api-key.schema";

export function useApiKeys() {
  return useQuery({
    queryKey: ["apiKeys"],
    queryFn: () => listApiKeys(),
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ApiKeyCreateInput) => createApiKey(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
    },
  });
}

export function useUpdateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ApiKeyCreateInput>;
    }) => updateApiKey(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
    },
  });
}

export function useDeleteApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
    },
  });
}
