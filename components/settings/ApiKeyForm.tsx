// 📁 파일 경로: components/settings/ApiKeyForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import SecretInput from "./SecretInput";
import {
  apiKeyCreateSchema,
  type ApiKeyCreateInput,
} from "@/lib/validations/api-key.schema";

interface ApiKeyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ApiKeyCreateInput) => Promise<void>;
  editData?: {
    id: string;
    serviceName: string;
    keyIdentifier: string;
    description: string | null;
    isActive: boolean;
    lastFourChars?: string;
  } | null;
  isLoading?: boolean;
}

export default function ApiKeyForm({
  open,
  onOpenChange,
  onSubmit,
  editData,
  isLoading = false,
}: ApiKeyFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ApiKeyCreateInput>({
    resolver: zodResolver(apiKeyCreateSchema),
    defaultValues: editData
      ? {
          serviceName: editData.serviceName,
          keyIdentifier: editData.keyIdentifier,
          description: editData.description ?? "",
          isActive: editData.isActive,
          keyValue: "",
        }
      : {
          serviceName: "",
          keyIdentifier: "",
          keyValue: "",
          description: "",
          isActive: true,
        },
  });

  const isActive = watch("isActive");
  const keyValue = watch("keyValue");

  const handleFormSubmit = async (data: ApiKeyCreateInput) => {
    await onSubmit(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editData ? "API 키 수정" : "새 API 키 등록"}
          </DialogTitle>
          <DialogDescription>
            {editData
              ? "API 키 정보를 수정합니다. 키 값은 보안을 위해 재입력이 필요합니다."
              : "새로운 API 키를 등록합니다. 키 값은 암호화되어 안전하게 저장됩니다."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="serviceName">서비스명</Label>
            <Input
              id="serviceName"
              placeholder="예: OpenAI GPT-4o"
              {...register("serviceName")}
            />
            {errors.serviceName && (
              <p className="text-sm text-[var(--color-danger)]">
                {errors.serviceName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="keyIdentifier">식별자</Label>
            <Input
              id="keyIdentifier"
              placeholder="예: OPENAI_API_KEY"
              {...register("keyIdentifier")}
            />
            {errors.keyIdentifier && (
              <p className="text-sm text-[var(--color-danger)]">
                {errors.keyIdentifier.message}
              </p>
            )}
            <p className="text-xs text-[var(--color-text-secondary)]">
              영문 대문자, 숫자, 언더스코어(_)만 사용 가능합니다.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keyValue">API Key 값</Label>
            <SecretInput
              value={keyValue}
              onChange={(v) => setValue("keyValue", v)}
              placeholder={
                editData
                  ? "새 키를 입력하세요 (변경 시에만)"
                  : "API Key를 입력하세요"
              }
              maskedValue={
                editData?.lastFourChars
                  ? `${"•".repeat(16)}${editData.lastFourChars}`
                  : undefined
              }
            />
            {errors.keyValue && (
              <p className="text-sm text-[var(--color-danger)]">
                {errors.keyValue.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">용도 설명 (선택)</Label>
            <Textarea
              id="description"
              placeholder="이 API Key의 용도를 입력하세요"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-[var(--color-danger)]">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">활성 상태</Label>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => setValue("isActive", checked)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "저장 중..." : editData ? "수정" : "등록"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
