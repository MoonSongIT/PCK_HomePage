// 📁 파일 경로: hooks/useDonations.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { listDonations } from "@/server/actions/donation.actions";
import { getTransparencyData } from "@/server/actions/finance.actions";

export function useDonations(params: {
  page?: number;
  pageSize?: number;
  donorName?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ["donations", params],
    queryFn: () => listDonations(params),
  });
}

export function useTransparencyData(year: number) {
  return useQuery({
    queryKey: ["transparency", year],
    queryFn: () => getTransparencyData(year),
  });
}
