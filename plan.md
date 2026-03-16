# 팍스 크리스티 코리아(Pax Christi Korea) 홈페이지 리뉴얼 — 구현 계획서

> 최종 업데이트: 2026-03-16
> 브랜치: `claude/pax-christi-website-renewal-cyqQ3`

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | 팍스 크리스티 코리아 홈페이지 리뉴얼 |
| 목표 | 평화·신뢰·투명성에 맞는 UI/UX 전면 리뉴얼, AI 도구 API Key 관리, 후원금 투명성 시스템 구축 |
| 기술 스택 | Next.js 15 (App Router) / TypeScript 5 / Tailwind CSS v4 / shadcn/ui / Prisma / PostgreSQL |
| 렌더링 전략 | SSG(소개/자료) + SSR(게시판/공지/후원) + CSR(관리자) |

---

## 2. 구현 단계 (Phase)

### Phase 1: 프로젝트 초기화 및 기반 구축 ✅ 완료

| 작업 | 상태 | 비고 |
|------|:----:|------|
| Next.js 15 프로젝트 생성 | ✅ | App Router + TypeScript strict |
| 의존성 설치 | ✅ | 38+ 패키지 (shadcn/ui, Recharts, Framer Motion 등) |
| 디렉토리 구조 설계 | ✅ | Route Groups: (public), (auth), (admin) |
| Tailwind CSS v4 + 디자인 시스템 | ✅ | CSS Variables 기반 평화 테마 |
| Google Fonts (Noto Sans KR / Noto Serif KR) | ✅ | next/font 최적화 적용 |

### Phase 2: 데이터 모델 및 핵심 라이브러리 ✅ 완료

| 작업 | 상태 | 파일 |
|------|:----:|------|
| 전역 타입 정의 (UserRole, 타입 등) | ✅ | `types/index.ts` |
| Prisma 스키마 (10개 모델) | ✅ | `prisma/schema.prisma` |
| Prisma 클라이언트 싱글톤 | ✅ | `lib/db.ts` |
| AES-256-GCM 암호화 유틸 | ✅ | `lib/crypto.ts` |
| NextAuth v5 설정 + RBAC | ✅ | `lib/auth.ts` |
| Upstash Redis 클라이언트 | ✅ | `lib/redis.ts` |
| Rate Limiting 설정 | ✅ | `lib/rate-limit.ts` |
| 유틸 함수 (cn, formatCurrency 등) | ✅ | `lib/utils.ts` |
| Zod 스키마 4종 | ✅ | `lib/validations/*.schema.ts` |
| 시드 데이터 (관리자/회원) | ✅ | `prisma/seed.ts` |

### Phase 3: 미들웨어 및 보안 ✅ 완료

| 작업 | 상태 | 파일 |
|------|:----:|------|
| 라우트 보호 미들웨어 | ✅ | `middleware.ts` |
| RBAC 5단계 역할 체계 | ✅ | SUPER_ADMIN → GUEST |
| 경로별 접근 매트릭스 | ✅ | 구체적 경로 우선 매칭 |
| 게스트 전용 라우트 (로그인/회원가입) | ✅ | 인증 시 리다이렉트 |

### Phase 4: UI 컴포넌트 ✅ 완료

| 분류 | 컴포넌트 | 상태 |
|------|----------|:----:|
| **ui/** | Button, Input, Card, Badge, Dialog, Label, Switch, Select, Tabs, Table, Textarea | ✅ |
| **layout/** | Header, Footer, AdminSidebar, MobileNav | ✅ |
| **home/** | HeroSection, ActivityHighlights, PeaceMessage, DonationCTA | ✅ |
| **finance/** | DonationChart, ExpenseChart, TransparencyTable, FinanceSummaryCard | ✅ |
| **settings/** | SecretInput, ApiKeyCard, ApiKeyForm | ✅ |
| **common/** | PageHeader, LoadingSpinner, ErrorBoundary, RoleGuard | ✅ |

### Phase 5: Server Actions ✅ 완료

| Server Action | 상태 | 파일 |
|---------------|:----:|------|
| API Key CRUD (listApiKeys, createApiKey, updateApiKey, deleteApiKey) | ✅ | `server/actions/api-key.actions.ts` |
| 인증 (registerUser, loginUser) | ✅ | `server/actions/auth.actions.ts` |
| 후원 (createDonation, listDonations, toggleDonationPublic) | ✅ | `server/actions/donation.actions.ts` |
| 재정 (getTransparencyData, createExpense, getFinanceDashboard) | ✅ | `server/actions/finance.actions.ts` |

### Phase 6: 커스텀 훅 ✅ 완료

| 훅 | 상태 | 파일 |
|----|:----:|------|
| useRole (현재 사용자 역할) | ✅ | `hooks/useRole.ts` |
| useDonations, useTransparencyData | ✅ | `hooks/useDonations.ts` |
| useApiKeys, useCreateApiKey, useUpdateApiKey, useDeleteApiKey | ✅ | `hooks/useApiKeys.ts` |

### Phase 7: 페이지 구현 ✅ 구조 완료 (일부 기능 미완성)

#### 공개 페이지 (public)
| 페이지 | 경로 | 상태 | 비고 |
|--------|------|:----:|------|
| 메인 홈 | `/` | ✅ | Hero 슬라이드 + 활동 + 교황 메시지 + 통계 + CTA |
| 단체 소개 | `/about` | ✅ | 설립배경, 비전, 핵심가치 |
| 국제 팍스 크리스티 | `/about/international` | ✅ | 소개 텍스트 (세계 지도 플레이스홀더) |
| 임원 소개 | `/about/members` | ✅ | 프로필 카드 (정적 데이터) |
| 활동 목록 | `/activities` | ✅ | 카드 그리드, DB 연동 |
| 활동 상세 | `/activities/[slug]` | ✅ | 동적 라우트, 텍스트 렌더링 |
| 자료실 | `/resources` | ⚠️ | 플레이스홀더 ("준비 중") |
| 공지사항 | `/board/notice` | ✅ | DB 연동 테이블 |
| 자유게시판 | `/board/free` | ✅ | DB 연동 테이블 |
| 후원 안내 | `/donation` | ⚠️ | UI 완성, 토스페이먼츠 결제 미연동 |
| 결제 완료 | `/donation/complete` | ✅ | 완료 안내 페이지 |
| 투명성 공개 | `/transparency` | ✅ | 연도별 탭, 차트, 테이블, 보고서 다운로드 |

#### 인증 페이지 (auth)
| 페이지 | 경로 | 상태 |
|--------|------|:----:|
| 로그인 | `/login` | ✅ |
| 회원가입 | `/register` | ✅ |
| 마이페이지 | `/mypage` | ✅ |
| 내 후원 내역 | `/mypage/donations` | ⚠️ 플레이스홀더 |

#### 관리자 페이지 (admin)
| 페이지 | 경로 | 상태 | 비고 |
|--------|------|:----:|------|
| 대시보드 | `/admin/dashboard` | ✅ | KPI 카드 + 월별 차트 |
| 후원금 현황 | `/admin/finance` | ✅ | → 대시보드 리다이렉트 |
| 후원 내역 관리 | `/admin/finance/donations` | ✅ | 검색, 공개 토글, 페이지네이션 |
| 지출 내역 관리 | `/admin/finance/expenses` | ✅ | 등록 모달 완성, 목록 표시 미완성 |
| 보고서 생성 | `/admin/finance/reports` | ⚠️ | 플레이스홀더 (PDF 생성 미구현) |
| 회원 관리 | `/admin/users` | ⚠️ | UI 완성, API 라우트 일부 미생성 |
| API Key 관리 | `/admin/settings/api-keys` | ✅ | CRUD 전체 구현 |
| 일반 설정 | `/admin/settings/general` | ⚠️ | UI 완성, 저장 로직 미구현 |
| 활동 게시물 관리 | `/admin/content/activities` | ⚠️ | 플레이스홀더 |
| 게시판 관리 | `/admin/content/board` | ⚠️ | 플레이스홀더 |

### Phase 8: API Routes ⚠️ 부분 완료

| API Route | 상태 | 비고 |
|-----------|:----:|------|
| `GET /api/auth/[...nextauth]` | ✅ | NextAuth 핸들러 |
| `GET /api/admin/users` | ✅ | 회원 목록 조회 |
| `PATCH /api/admin/users/[id]/role` | ❌ | 미생성 (users 페이지에서 호출) |
| `PATCH /api/admin/users/[id]/status` | ❌ | 미생성 (users 페이지에서 호출) |
| `POST /api/donation/webhook` | ❌ | 토스페이먼츠 웹훅 미구현 |

### Phase 9: 테스트 ✅ 완료 (핵심 유틸)

| 테스트 파일 | 테스트 수 | 상태 |
|-------------|:---------:|:----:|
| `__tests__/lib/crypto.test.ts` | 7 | ✅ |
| `__tests__/lib/validations.test.ts` | 12 | ✅ |
| `__tests__/lib/utils.test.ts` | 11 | ✅ |
| **합계** | **30** | **전체 통과** |

---

## 3. 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────┐
│                   클라이언트                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │(public)  │ │ (auth)   │ │    (admin)       │ │
│  │SSG + SSR │ │  CSR     │ │     CSR          │ │
│  └────┬─────┘ └────┬─────┘ └────────┬─────────┘ │
└───────┼────────────┼────────────────┼────────────┘
        │            │                │
┌───────▼────────────▼────────────────▼────────────┐
│              미들웨어 (middleware.ts)              │
│         라우트 보호 + RBAC 역할 검증               │
└───────────────────────┬──────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────┐
│             Server Actions / API Routes           │
│  ┌────────────┐ ┌──────────┐ ┌────────────────┐  │
│  │ auth()     │ │ crypto   │ │ rate-limit     │  │
│  │ requireAuth│ │ encrypt  │ │ authRateLimit  │  │
│  └─────┬──────┘ │ decrypt  │ │ donationRate.. │  │
│        │        └──────────┘ └────────────────┘  │
└────────┼─────────────────────────────────────────┘
         │
┌────────▼─────────────────────────────────────────┐
│                  데이터 계층                       │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │
│  │ Prisma   │  │ Upstash  │  │  Supabase      │  │
│  │PostgreSQL│  │  Redis   │  │  Storage       │  │
│  └──────────┘  └──────────┘  └────────────────┘  │
└──────────────────────────────────────────────────┘
```

---

## 4. 디자인 시스템 요약

```
색상 팔레트:
  Primary   : #2C5F8A (평화의 파랑)
  Secondary : #4A7C59 (올리브 그린)
  Accent    : #C9A84C (금색)
  Background: #F5F3EF (따뜻한 아이보리)
  Surface   : #FFFFFF
  Danger    : #C0392B
  Success   : #27AE60

폰트:
  본문  : Noto Sans KR (16px, 줄간격 1.7)
  제목  : Noto Serif KR (격식체)
```

---

## 5. 파일 구조 요약 (110개 파일)

```
PCK_HomePage/
├── app/                         # 38 파일 (페이지 + 레이아웃 + API)
│   ├── (public)/                # 15 페이지
│   ├── (auth)/                  # 5 페이지
│   ├── (admin)/                 # 13 페이지
│   └── api/                     # 2 라우트
├── components/                  # 22 컴포넌트
│   ├── ui/ (11) │ layout/ (4) │ home/ (4)
│   ├── finance/ (4) │ settings/ (3) │ common/ (4)
├── lib/                         # 10 파일
├── hooks/                       # 3 파일
├── server/actions/              # 4 파일
├── types/                       # 1 파일
├── prisma/                      # 2 파일
├── __tests__/                   # 3 파일 (30 테스트)
└── 설정 파일                    # 8 파일
```

---

## 6. 보안 설계

| 항목 | 구현 방식 | 상태 |
|------|----------|:----:|
| API Key 암호화 | AES-256-GCM + 랜덤 IV | ✅ |
| 역할 기반 접근제어 | 미들웨어 + Server Action 이중 검증 | ✅ |
| CSRF | NextAuth 내장 + Server Action 기본 보호 | ✅ |
| SQL Injection | Prisma ORM 자동 방어 | ✅ |
| Rate Limiting | Upstash Ratelimit (설정 완료) | ✅ |
| 환경변수 보안 | NEXT_PUBLIC_ 접두사 없음 (서버 전용) | ✅ |
| 후원자 개인정보 | anonymizeName() 익명 처리 함수 | ✅ |
| XSS | Next.js 기본 이스케이프 | ✅ |
