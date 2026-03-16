// 📁 파일 경로: app/(admin)/finance/expenses/page.tsx
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createExpense } from "@/server/actions/finance.actions";
import {
  expenseCreateSchema,
  type ExpenseCreateInput,
} from "@/lib/validations/finance.schema";
import { EXPENSE_CATEGORY_LABELS } from "@/types";

export default function ExpensesPage() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ExpenseCreateInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(expenseCreateSchema) as any,
    defaultValues: {
      title: "",
      amount: 0,
      category: "OPERATIONS",
      expenseDate: "",
      description: "",
      isPublic: false,
    },
  });

  const isPublic = watch("isPublic");

  const onSubmit = async (data: ExpenseCreateInput) => {
    setIsSubmitting(true);
    const result = await createExpense(data);
    setIsSubmitting(false);
    if (result.success) {
      reset();
      setOpen(false);
    } else {
      alert(result.error);
    }
  };

  return (
    <div>
      <PageHeader
        title="지출 내역 관리"
        description="지출 내역을 등록하고 관리합니다."
      >
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          지출 등록
        </Button>
      </PageHeader>

      <div className="py-16 text-center text-[var(--color-text-secondary)]">
        지출 내역이 여기에 표시됩니다.
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>지출 등록</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">항목명</Label>
              <Input id="title" {...register("title")} />
              {errors.title && (
                <p className="text-sm text-[var(--color-danger)]">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">금액 (원)</Label>
              <Input
                id="amount"
                type="number"
                {...register("amount", { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-sm text-[var(--color-danger)]">
                  {errors.amount.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>카테고리</Label>
              <Select
                defaultValue="OPERATIONS"
                onValueChange={(v) =>
                  setValue(
                    "category",
                    v as ExpenseCreateInput["category"]
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EXPENSE_CATEGORY_LABELS).map(
                    ([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expenseDate">날짜</Label>
              <Input
                id="expenseDate"
                type="date"
                {...register("expenseDate")}
              />
              {errors.expenseDate && (
                <p className="text-sm text-[var(--color-danger)]">
                  {errors.expenseDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">설명 (선택)</Label>
              <Textarea
                id="description"
                {...register("description")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>투명성 페이지 공개</Label>
              <Switch
                checked={isPublic}
                onCheckedChange={(v) => setValue("isPublic", v)}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "등록 중..." : "등록"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
