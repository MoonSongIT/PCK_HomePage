// 📁 파일 경로: app/(admin)/users/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { formatDate } from "@/lib/utils";
import type { UserRole } from "@/types";

interface UserRow {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  _count: { donations: number };
}

const ROLE_COLORS: Record<UserRole, "default" | "secondary" | "outline" | "destructive" | "success"> = {
  SUPER_ADMIN: "destructive",
  ADMIN: "default",
  FINANCE: "secondary",
  MEMBER: "outline",
  GUEST: "outline",
};

const ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN", "FINANCE", "MEMBER", "GUEST"];

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users?" + new URLSearchParams({ search }));
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    // Optimistic update
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, role: newRole as UserRole } : u
      )
    );

    try {
      await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
    } catch {
      fetchUsers(); // Revert on failure
    }
  };

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isActive } : u))
    );

    try {
      await fetch(`/api/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
    } catch {
      fetchUsers();
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="회원 관리"
        description="회원 목록과 권한을 관리합니다."
      />

      {/* 검색 */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-secondary)]" />
          <Input
            placeholder="이름 또는 이메일로 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>이름</TableHead>
            <TableHead>이메일</TableHead>
            <TableHead>역할</TableHead>
            <TableHead>가입일</TableHead>
            <TableHead>최근 로그인</TableHead>
            <TableHead>후원</TableHead>
            <TableHead>상태</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-[var(--color-text-secondary)]"
              >
                회원이 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.name || "-"}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onValueChange={(v) => handleRoleChange(user.id, v)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue>
                        <Badge variant={ROLE_COLORS[user.role]}>
                          {user.role}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell>
                  {user.lastLoginAt
                    ? formatDate(user.lastLoginAt)
                    : "-"}
                </TableCell>
                <TableCell>
                  {user._count.donations > 0 ? (
                    <Badge variant="success">O</Badge>
                  ) : (
                    <span className="text-[var(--color-text-secondary)]">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={user.isActive}
                    onCheckedChange={(v) =>
                      handleToggleActive(user.id, v)
                    }
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
