// 📁 파일 경로: server/actions/finance.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { expenseCreateSchema } from "@/lib/validations/finance.schema";
import type {
  ApiResponse,
  TransparencyData,
  MonthlyFinanceData,
  ExpenseByCategoryData,
  DonationSummary,
} from "@/types";
import { EXPENSE_CATEGORY_LABELS } from "@/types";

/**
 * 투명성 페이지용 연도별 재정 데이터를 조회한다. (공개)
 */
export async function getTransparencyData(
  year: number
): Promise<ApiResponse<TransparencyData>> {
  try {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    // 공개 후원금 합계
    const donations = await db.donation.findMany({
      where: {
        status: "COMPLETED",
        createdAt: { gte: startDate, lt: endDate },
      },
    });

    const publicDonations = donations.filter((d) => d.isPublic);

    // 공개 지출 합계
    const expenses = await db.expense.findMany({
      where: {
        expenseDate: { gte: startDate, lt: endDate },
      },
    });

    const publicExpenses = expenses.filter((e) => e.isPublic);

    const totalIncome = donations.reduce((sum, d) => sum + d.amount, 0);
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

    // 월별 데이터
    const monthlyData: MonthlyFinanceData[] = Array.from(
      { length: 12 },
      (_, i) => {
        const monthDonations = donations.filter(
          (d) => d.createdAt.getMonth() === i
        );
        const monthExpenses = expenses.filter(
          (e) => e.expenseDate.getMonth() === i
        );
        return {
          month: `${i + 1}월`,
          income: monthDonations.reduce((sum, d) => sum + d.amount, 0),
          expense: monthExpenses.reduce((sum, e) => sum + e.amount, 0),
        };
      }
    );

    // 카테고리별 지출
    const categoryMap = new Map<string, number>();
    expenses.forEach((e) => {
      const current = categoryMap.get(e.category) || 0;
      categoryMap.set(e.category, current + e.amount);
    });

    const expenseByCategory: ExpenseByCategoryData[] = Array.from(
      categoryMap.entries()
    ).map(([category, amount]) => ({
      category: category as ExpenseByCategoryData["category"],
      label:
        EXPENSE_CATEGORY_LABELS[
          category as keyof typeof EXPENSE_CATEGORY_LABELS
        ] || category,
      amount,
      percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
    }));

    const donorCount = new Set(donations.map((d) => d.donorEmail)).size;

    const summary: DonationSummary = {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      donorCount,
    };

    return {
      success: true,
      data: {
        year,
        summary,
        monthlyData,
        expenseByCategory,
        publicDonations: publicDonations.map((d) => ({
          id: d.id,
          donorName: d.donorName,
          amount: d.amount,
          isRecurring: d.isRecurring,
          paymentMethod: d.paymentMethod,
          status: d.status,
          isPublic: d.isPublic,
          createdAt: d.createdAt,
        })),
        publicExpenses: publicExpenses.map((e) => ({
          id: e.id,
          title: e.title,
          amount: e.amount,
          category: e.category,
          expenseDate: e.expenseDate,
          description: e.description,
          receiptUrl: e.receiptUrl,
          isPublic: e.isPublic,
          createdAt: e.createdAt,
        })),
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "재정 데이터 조회에 실패했습니다.",
    };
  }
}

/**
 * 관리자: 지출 내역을 등록한다.
 */
export async function createExpense(
  formData: unknown
): Promise<ApiResponse<{ id: string }>> {
  try {
    const user = await requireAuth(["SUPER_ADMIN", "ADMIN", "FINANCE"]);
    const parsed = expenseCreateSchema.parse(formData);

    const expense = await db.expense.create({
      data: {
        title: parsed.title,
        amount: parsed.amount,
        category: parsed.category,
        expenseDate: new Date(parsed.expenseDate),
        description: parsed.description ?? null,
        receiptUrl: parsed.receiptUrl ?? null,
        isPublic: parsed.isPublic,
        createdById: user.id,
      },
    });

    revalidatePath("/admin/finance/expenses");
    revalidatePath("/transparency");
    return { success: true, data: { id: expense.id } };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "지출 등록에 실패했습니다.",
    };
  }
}

/**
 * 관리자: 대시보드 KPI 데이터를 조회한다.
 */
export async function getFinanceDashboard(): Promise<
  ApiResponse<{
    monthlyIncome: number;
    monthlyExpense: number;
    totalBalance: number;
    newDonors: number;
    monthlyData: MonthlyFinanceData[];
  }>
> {
  try {
    await requireAuth(["SUPER_ADMIN", "ADMIN", "FINANCE"]);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // 이번 달 수입
    const monthDonations = await db.donation.aggregate({
      where: {
        status: "COMPLETED",
        createdAt: { gte: startOfMonth },
      },
      _sum: { amount: true },
    });

    // 이번 달 지출
    const monthExpenses = await db.expense.aggregate({
      where: {
        expenseDate: { gte: startOfMonth },
      },
      _sum: { amount: true },
    });

    // 전체 잔액
    const totalDonations = await db.donation.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true },
    });
    const totalExpenses = await db.expense.aggregate({
      _sum: { amount: true },
    });

    // 이번 달 신규 후원자
    const newDonors = await db.donation.groupBy({
      by: ["donorEmail"],
      where: {
        status: "COMPLETED",
        createdAt: { gte: startOfMonth },
      },
    });

    // 연간 월별 데이터
    const yearDonations = await db.donation.findMany({
      where: {
        status: "COMPLETED",
        createdAt: { gte: startOfYear },
      },
    });
    const yearExpenses = await db.expense.findMany({
      where: { expenseDate: { gte: startOfYear } },
    });

    const monthlyData: MonthlyFinanceData[] = Array.from(
      { length: 12 },
      (_, i) => ({
        month: `${i + 1}월`,
        income: yearDonations
          .filter((d) => d.createdAt.getMonth() === i)
          .reduce((sum, d) => sum + d.amount, 0),
        expense: yearExpenses
          .filter((e) => e.expenseDate.getMonth() === i)
          .reduce((sum, e) => sum + e.amount, 0),
      })
    );

    return {
      success: true,
      data: {
        monthlyIncome: monthDonations._sum.amount || 0,
        monthlyExpense: monthExpenses._sum.amount || 0,
        totalBalance:
          (totalDonations._sum.amount || 0) -
          (totalExpenses._sum.amount || 0),
        newDonors: newDonors.length,
        monthlyData,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "대시보드 데이터 조회에 실패했습니다.",
    };
  }
}
