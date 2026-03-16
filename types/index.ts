// 📁 파일 경로: types/index.ts

// ============================================
// 사용자 역할 (RBAC)
// ============================================
export type UserRole =
  | "SUPER_ADMIN"  // 전체 권한 (API 설정 포함)
  | "ADMIN"        // 콘텐츠·회원·후원 관리
  | "FINANCE"      // 후원금 입출력만 관리
  | "MEMBER"       // 회원 기능 (후원, 게시판)
  | "GUEST";       // 비회원 (공개 페이지만)

// ============================================
// 후원 상태
// ============================================
export type DonationStatus = "PENDING" | "COMPLETED" | "CANCELLED" | "REFUNDED";

// ============================================
// 지출 카테고리
// ============================================
export type ExpenseCategory =
  | "PEACE_EDUCATION"
  | "CAMPAIGN"
  | "INTERNATIONAL"
  | "OPERATIONS"
  | "RESERVE";

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  PEACE_EDUCATION: "평화교육",
  CAMPAIGN: "캠페인",
  INTERNATIONAL: "국제연대",
  OPERATIONS: "운영비",
  RESERVE: "적립금",
};

// ============================================
// API Key 관련 타입
// ============================================
export interface ApiKeyConfig {
  id: string;
  serviceName: string;
  keyIdentifier: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastFourChars?: string;
}

export interface ApiKeyCreateInput {
  serviceName: string;
  keyIdentifier: string;
  keyValue: string;
  description?: string;
  isActive?: boolean;
}

export interface ApiKeyUpdateInput {
  serviceName?: string;
  keyIdentifier?: string;
  keyValue?: string;
  description?: string;
  isActive?: boolean;
}

// ============================================
// 후원금 관련 타입
// ============================================
export interface DonationSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  donorCount: number;
}

export interface MonthlyFinanceData {
  month: string;
  income: number;
  expense: number;
}

export interface ExpenseByCategoryData {
  category: ExpenseCategory;
  label: string;
  amount: number;
  percentage: number;
}

export interface DonationRecord {
  id: string;
  donorName: string;
  amount: number;
  isRecurring: boolean;
  paymentMethod: string;
  status: DonationStatus;
  isPublic: boolean;
  createdAt: Date;
}

export interface ExpenseRecord {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  expenseDate: Date;
  description: string | null;
  receiptUrl: string | null;
  isPublic: boolean;
  createdAt: Date;
}

// ============================================
// 사용자 관련 타입
// ============================================
export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  lastLoginAt: Date | null;
  hasDonations: boolean;
}

// ============================================
// 투명성 페이지 타입
// ============================================
export interface TransparencyData {
  year: number;
  summary: DonationSummary;
  monthlyData: MonthlyFinanceData[];
  expenseByCategory: ExpenseByCategoryData[];
  publicDonations: DonationRecord[];
  publicExpenses: ExpenseRecord[];
}

export interface FinanceReport {
  id: string;
  year: number;
  period: string;
  fileUrl: string;
  isPublished: boolean;
  createdAt: Date;
}

// ============================================
// 활동/게시판 관련 타입
// ============================================
export type ActivityCategory = "PEACE_EDUCATION" | "CAMPAIGN" | "INTERNATIONAL" | "PRAYER";

export const ACTIVITY_CATEGORY_LABELS: Record<ActivityCategory, string> = {
  PEACE_EDUCATION: "평화교육",
  CAMPAIGN: "캠페인",
  INTERNATIONAL: "국제연대",
  PRAYER: "기도모임",
};

export interface Activity {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: ActivityCategory;
  thumbnailUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// 공통 타입
// ============================================
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================
// 네비게이션 타입
// ============================================
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    label: "단체 소개",
    href: "/about",
    children: [
      { label: "소개", href: "/about" },
      { label: "국제 팍스 크리스티", href: "/about/international" },
      { label: "임원 소개", href: "/about/members" },
    ],
  },
  {
    label: "활동 소식",
    href: "/activities",
  },
  {
    label: "자료실",
    href: "/resources",
  },
  {
    label: "게시판",
    href: "/board/notice",
    children: [
      { label: "공지사항", href: "/board/notice" },
      { label: "자유게시판", href: "/board/free" },
    ],
  },
  {
    label: "후원하기",
    href: "/donation",
  },
  {
    label: "투명성 공개",
    href: "/transparency",
  },
];
