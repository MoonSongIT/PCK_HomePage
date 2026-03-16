// 📁 파일 경로: server/actions/donation.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import type { ApiResponse, PaginatedResponse, DonationRecord } from "@/types";

/**
 * 후원 결제 완료 후 후원 내역을 생성한다.
 */
export async function createDonation(data: {
  donorName: string;
  donorEmail: string;
  amount: number;
  isRecurring: boolean;
  paymentMethod: string;
  paymentKey: string;
  orderId: string;
  userId?: string;
}): Promise<ApiResponse<{ id: string }>> {
  try {
    const donation = await db.donation.create({
      data: {
        donorName: data.donorName,
        donorEmail: data.donorEmail,
        amount: data.amount,
        isRecurring: data.isRecurring,
        paymentMethod: data.paymentMethod,
        paymentKey: data.paymentKey,
        orderId: data.orderId,
        userId: data.userId,
        status: "COMPLETED",
      },
    });

    revalidatePath("/admin/finance/donations");
    revalidatePath("/transparency");
    return { success: true, data: { id: donation.id } };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "후원 등록에 실패했습니다.",
    };
  }
}

/**
 * 관리자: 후원 내역 목록을 조회한다.
 */
export async function listDonations(params: {
  page?: number;
  pageSize?: number;
  donorName?: string;
  status?: string;
}): Promise<ApiResponse<PaginatedResponse<DonationRecord>>> {
  try {
    await requireAuth(["SUPER_ADMIN", "ADMIN", "FINANCE"]);

    const page = params.page || 1;
    const pageSize = params.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};
    if (params.donorName) {
      where.donorName = { contains: params.donorName };
    }
    if (params.status) {
      where.status = params.status;
    }

    const [donations, total] = await Promise.all([
      db.donation.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      db.donation.count({ where }),
    ]);

    return {
      success: true,
      data: {
        data: donations as DonationRecord[],
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "후원 내역 조회에 실패했습니다.",
    };
  }
}

/**
 * 관리자: 후원의 공개 여부를 토글한다.
 */
export async function toggleDonationPublic(
  id: string
): Promise<ApiResponse> {
  try {
    await requireAuth(["SUPER_ADMIN", "ADMIN", "FINANCE"]);

    const donation = await db.donation.findUnique({ where: { id } });
    if (!donation) {
      return { success: false, error: "후원 내역을 찾을 수 없습니다." };
    }

    await db.donation.update({
      where: { id },
      data: { isPublic: !donation.isPublic },
    });

    revalidatePath("/admin/finance/donations");
    revalidatePath("/transparency");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "변경에 실패했습니다.",
    };
  }
}
