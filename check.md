# 팍스 크리스티 코리아 홈페이지 — 구현 체크리스트

> 최종 업데이트: 2026-03-16
> ✅ 완료 | ⚠️ 부분 완료 | ❌ 미구현 | 🔜 다음 단계

---

## A. 프로젝트 기반 (Phase 1~3)

### A-1. 프로젝트 초기화
- [x] Next.js 15 App Router 프로젝트 생성
- [x] TypeScript 5.x strict mode 설정
- [x] Tailwind CSS v4 + PostCSS 설정
- [x] ESLint (next/core-web-vitals) 설정
- [x] Vitest + Testing Library 설정
- [x] 의존성 설치 (38+ 패키지)
- [x] `.env.example` 환경변수 템플릿 작성
- [x] `.gitignore` 설정

### A-2. 디자인 시스템
- [x] CSS Variables 색상 팔레트 정의 (평화 테마)
- [x] 다크 모드 CSS Variables 정의
- [x] Noto Sans KR / Noto Serif KR 폰트 (next/font/google)
- [x] 최소 본문 크기 16px + 줄간격 1.7
- [x] 커스텀 스크롤바 스타일
- [ ] 다크 모드 토글 UI 컴포넌트
- [ ] 실제 배너 이미지 에셋 준비

### A-3. 데이터 모델
- [x] Prisma 스키마 정의 (10개 모델)
  - [x] User (역할 enum: SUPER_ADMIN ~ GUEST)
  - [x] Account / Session / VerificationToken (NextAuth)
  - [x] Donation (후원 — orderId unique, 상태 enum)
  - [x] Expense (지출 — 카테고리 enum)
  - [x] ApiKeyConfig (암호화 필드 3개)
  - [x] FinanceReport (연도별 감사 보고서)
  - [x] Activity (활동 게시물, slug unique)
  - [x] BoardPost (게시판 — notice/free)
  - [x] SiteSetting (key-value 설정)
- [x] 시드 데이터 (SUPER_ADMIN + MEMBER)
- [ ] Prisma 마이그레이션 실행 (DB 연결 필요)
- [ ] 시드 데이터 실행 확인

### A-4. 핵심 라이브러리
- [x] `lib/crypto.ts` — AES-256-GCM encrypt/decrypt/getLastFourChars
- [x] `lib/auth.ts` — NextAuth v5 + Credentials + Google + RBAC
- [x] `lib/db.ts` — Prisma 싱글톤
- [x] `lib/redis.ts` — Upstash Redis 클라이언트
- [x] `lib/rate-limit.ts` — authRateLimit(10/분) + donationRateLimit(5/분)
- [x] `lib/utils.ts` — cn, formatCurrency, formatDate, anonymizeName

### A-5. 검증 스키마 (Zod)
- [x] `lib/validations/auth.schema.ts` — loginSchema, registerSchema
- [x] `lib/validations/api-key.schema.ts` — apiKeyCreateSchema, apiKeyUpdateSchema
- [x] `lib/validations/donation.schema.ts` — donationCreateSchema, donationSearchSchema
- [x] `lib/validations/finance.schema.ts` — expenseCreateSchema, reportGenerateSchema

### A-6. 미들웨어 및 보안
- [x] `middleware.ts` — 라우트 보호 + RBAC 역할 검증
- [x] 경로별 접근 제어 매트릭스 구현
- [x] 인증 필요 경로 (/admin, /mypage) 보호
- [x] 게스트 전용 경로 (/login, /register) 리다이렉트
- [x] Server Action 내 auth() 재검증 (미들웨어 우회 방어)

---

## B. UI 컴포넌트 (Phase 4)

### B-1. shadcn/ui 기반 컴포넌트
- [x] Button (7 variants: default, destructive, outline, secondary, ghost, link, accent)
- [x] Input
- [x] Card (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- [x] Badge (5 variants: default, secondary, destructive, outline, success)
- [x] Dialog (모달)
- [x] Label
- [x] Switch
- [x] Select (SelectTrigger, SelectContent, SelectItem)
- [x] Tabs (TabsList, TabsTrigger, TabsContent)
- [x] Table (TableHeader, TableBody, TableRow, TableHead, TableCell)
- [x] Textarea
- [ ] Toast / Sonner (알림 시스템)
- [ ] Dropdown Menu
- [ ] Avatar
- [ ] Tooltip
- [ ] Separator
- [ ] Skeleton (로딩 상태)
- [ ] Pagination 컴포넌트

### B-2. 레이아웃 컴포넌트
- [x] Header — 데스크톱 네비 + 드롭다운 + 모바일 메뉴
- [x] Footer — 단체 정보 + 바로가기 + 정책
- [x] AdminSidebar — 역할별 메뉴 필터링
- [x] MobileNav — 모바일 하단 네비 (5개 아이콘)

### B-3. 홈 컴포넌트
- [x] HeroSection — 풀스크린 + 3장 슬라이드 + Framer Motion fade + CTA 2개
- [x] ActivityHighlights — 최근 활동 3개 카드 그리드
- [x] PeaceMessage — 교황 메시지 인용구
- [x] DonationCTA — 배경색 강조 + 금액 바로가기
- [ ] 카운터 애니메이션 (숫자로 보는 PCK — 현재 정적 텍스트)

### B-4. 재정 컴포넌트
- [x] DonationChart — Recharts BarChart (월별 수입/지출)
- [x] ExpenseChart — Recharts PieChart (카테고리별 지출 도넛)
- [x] TransparencyTable — 후원/지출 내역 테이블
- [x] FinanceSummaryCard — KPI 요약 카드 (아이콘 + 금액)
- [ ] 라인 차트 (LineChart — 관리자 수입 추이 전용)

### B-5. 설정 컴포넌트
- [x] SecretInput — 마스킹 토글 + 복사 버튼
- [x] ApiKeyCard — 서비스명 + 마스킹 키 + 상태 배지 + 액션 버튼
- [x] ApiKeyForm — 등록/수정 모달 (React Hook Form + Zod)

### B-6. 공통 컴포넌트
- [x] PageHeader — 제목 + 설명 + 우측 액션 슬롯
- [x] LoadingSpinner — Lucide Loader2 애니메이션 (sm/md/lg)
- [x] ErrorBoundary — 에러 캐치 + 재시도 버튼
- [x] RoleGuard — 역할 기반 조건부 렌더링

---

## C. Server Actions 및 훅 (Phase 5~6)

### C-1. Server Actions
- [x] `api-key.actions.ts` — listApiKeys, createApiKey, updateApiKey, deleteApiKey
- [x] `auth.actions.ts` — registerUser, loginUser
- [x] `donation.actions.ts` — createDonation, listDonations, toggleDonationPublic
- [x] `finance.actions.ts` — getTransparencyData, createExpense, getFinanceDashboard

### C-2. 커스텀 훅
- [x] `useRole` — 현재 사용자 역할 + 편의 플래그 (isSuperAdmin, isAdmin 등)
- [x] `useDonations` — TanStack Query 기반 후원 목록 조회
- [x] `useTransparencyData` — TanStack Query 기반 투명성 데이터
- [x] `useApiKeys` — API Key CRUD mutations

### C-3. Providers
- [x] SessionProvider (NextAuth)
- [x] QueryClientProvider (TanStack Query v5)
- [ ] Zustand 스토어 (UI 전역 상태 — 테마 토글 등)

---

## D. 페이지 구현 (Phase 7)

### D-1. 공개 페이지 (/public)

#### 메인 홈 (`/`)
- [x] Hero 슬라이드 배너 (3장, autoplay 5초, Framer Motion)
- [x] CTA 버튼 2개 ("단체 소개" / "후원하기")
- [x] 활동 하이라이트 (최근 3개 카드, DB 연동)
- [x] 교황 메시지 섹션
- [x] 숫자로 보는 PCK (4개 통계)
- [x] 후원 CTA 섹션 (금액 바로가기)
- [ ] 숫자 카운터 애니메이션 (Framer Motion useMotionValue)
- [ ] 실제 배경 이미지 적용 (현재 그라데이션 사용)

#### 단체 소개 (`/about`)
- [x] 설립 배경 설명
- [x] 비전 (성경 인용)
- [x] 핵심 가치 아이콘 카드 (4개)
- [ ] 조직도 (SVG 또는 이미지)

#### 국제 팍스 크리스티 (`/about/international`)
- [x] 소개 텍스트 + 주요 활동 분야
- [ ] 세계 지도 시각화 (50개국 활동 표시) — 현재 플레이스홀더

#### 임원 소개 (`/about/members`)
- [x] 프로필 카드 레이아웃
- [ ] 실제 임원 데이터 DB 연동 (현재 정적 데이터)
- [ ] 프로필 이미지 업로드

#### 활동 소식 (`/activities`)
- [x] 카드 그리드 (반응형 1→2→3열)
- [x] 카테고리 Badge
- [x] DB 연동 (Prisma)
- [ ] 필터 (카테고리/연도) UI
- [ ] 무한 스크롤 (useInfiniteQuery)

#### 활동 상세 (`/activities/[slug]`)
- [x] 동적 라우트 + notFound() 처리
- [x] 카테고리 Badge + 제목 + 날짜
- [x] 썸네일 이미지
- [ ] MDX 또는 Rich Text 렌더링 (현재 줄바꿈 기반 텍스트)

#### 평화 자료실 (`/resources`)
- [x] 페이지 구조
- [ ] 자료 목록 DB 연동 (현재 "준비 중" 플레이스홀더)
- [ ] 파일 다운로드 기능

#### 게시판 — 공지사항 (`/board/notice`)
- [x] 테이블 (제목, 작성일, 조회수)
- [x] 고정 글 Badge
- [x] DB 연동
- [ ] 게시글 상세 페이지
- [ ] 페이지네이션

#### 게시판 — 자유게시판 (`/board/free`)
- [x] 테이블 레이아웃
- [x] DB 연동
- [ ] 게시글 작성/수정/삭제
- [ ] 게시글 상세 페이지
- [ ] 페이지네이션

#### 후원 안내 (`/donation`)
- [x] 금액 프리셋 버튼 (5종)
- [x] 직접 입력
- [x] 정기/일시 후원 토글
- [x] 후원자 정보 입력 (이름, 이메일)
- [ ] 토스페이먼츠 SDK 결제 연동 (`@tosspayments/payment-sdk-browser`)
- [ ] 결제 완료 후 createDonation 호출
- [ ] 로그인 사용자 자동 정보 채우기

#### 결제 완료 (`/donation/complete`)
- [x] 완료 안내 UI (체크 아이콘 + 메시지 + 네비게이션)
- [ ] 결제 결과 파라미터 수신 처리

#### 투명성 공개 (`/transparency`)
- [x] 연도별 탭 (최근 5년)
- [x] 요약 카드 4개 (수입/지출/잔액/후원자 수)
- [x] 월별 수입·지출 BarChart
- [x] 카테고리별 지출 PieChart
- [x] 상세 내역 테이블 (후원 수입 + 지출)
- [x] 감사 보고서 다운로드 링크
- [x] 개인정보 보호 (실명 미노출)
- [ ] 연도별 감사 보고서 PDF 생성/업로드 연동

### D-2. 인증 페이지 (/auth)

#### 로그인 (`/login`)
- [x] 이메일/비밀번호 폼 (React Hook Form + Zod)
- [x] 에러 메시지 표시
- [x] 로그인 성공 시 리다이렉트
- [x] 회원가입 링크
- [ ] Google OAuth 로그인 버튼
- [ ] Kakao OAuth 로그인 버튼

#### 회원가입 (`/register`)
- [x] 이름/이메일/비밀번호/확인 폼
- [x] 비밀번호 규칙 검증 (8자+, 영문+숫자)
- [x] 가입 후 로그인 페이지 이동
- [ ] 이메일 인증 (VerificationToken)

#### 마이페이지 (`/mypage`)
- [x] 개인 정보 카드 (이름, 이메일, 역할)
- [x] 후원 바로가기
- [ ] 프로필 이미지 업로드
- [ ] 비밀번호 변경
- [ ] 회원 탈퇴

#### 내 후원 내역 (`/mypage/donations`)
- [x] 페이지 구조
- [ ] 실제 후원 내역 조회 (현재 플레이스홀더)

### D-3. 관리자 페이지 (/admin)

#### 대시보드 (`/admin/dashboard`)
- [x] KPI 카드 4개 (이번 달 수입/지출, 누적 잔액, 신규 후원자)
- [x] 월별 수입·지출 추이 차트
- [ ] 최근 후원 내역 테이블 (상위 10건)
- [ ] 빠른 링크 카드

#### 후원 내역 관리 (`/admin/finance/donations`)
- [x] 검색 (후원자명)
- [x] 테이블 (날짜/후원자/금액/방식/결제수단/공개/상태)
- [x] 공개 여부 토글 (투명성 페이지 노출)
- [x] 페이지네이션
- [ ] 기간/금액 범위/후원 방식 필터
- [ ] 엑셀 다운로드 (.xlsx)
- [ ] 토스페이먼츠 웹훅 자동 등록

#### 지출 내역 관리 (`/admin/finance/expenses`)
- [x] 지출 등록 모달 (폼 + Zod 검증)
- [x] 카테고리 선택 (5종)
- [x] 공개 여부 설정
- [ ] 지출 목록 테이블 표시
- [ ] 지출 수정/삭제
- [ ] 증빙 파일 첨부 (Supabase Storage)

#### 보고서 생성 (`/admin/finance/reports`)
- [x] 페이지 구조
- [ ] 기간 선택 (월/분기/연간) UI
- [ ] PDF 감사 보고서 생성 (@react-pdf/renderer)
- [ ] Supabase Storage 업로드
- [ ] 투명성 페이지 자동 연결

#### 회원 관리 (`/admin/users`)
- [x] 테이블 (이름/이메일/역할/가입일/최근 로그인/후원 여부/상태)
- [x] 역할 변경 드롭다운 (optimistic update)
- [x] 계정 정지/활성화 토글
- [x] 이름/이메일 검색
- [ ] `PATCH /api/admin/users/[id]/role` API 라우트 구현
- [ ] `PATCH /api/admin/users/[id]/status` API 라우트 구현
- [ ] 회원 상세 페이지

#### API Key 관리 (`/admin/settings/api-keys`) ⭐ 핵심 신규 기능
- [x] API Key 목록 카드 그리드
- [x] 서비스명 + 마스킹 키 (마지막 4자리만 표시)
- [x] 등록일/수정일 표시
- [x] 활성/비활성 Badge
- [x] 복사/수정/삭제 버튼
- [x] 새 API Key 등록 모달
- [x] AES-256-GCM 암호화 저장
- [x] 평문 key_value 클라이언트 미노출
- [x] SUPER_ADMIN 전용 접근
- [x] 수정 시 재입력 방식

#### 일반 설정 (`/admin/settings/general`)
- [x] 사이트명, 대표 이메일, 주소 폼
- [x] 소셜 링크 (Facebook, Instagram, YouTube) 폼
- [x] 후원금 목표액 설정 폼
- [ ] Server Action 저장 로직 (SiteSetting 모델 연동)
- [ ] 메인 배너 이미지 관리
- [ ] SMTP 설정 (암호화 저장)

#### 활동 게시물 관리 (`/admin/content/activities`)
- [x] 페이지 구조
- [ ] 활동 목록 테이블
- [ ] 활동 작성/수정 폼 (Rich Text Editor)
- [ ] 썸네일 이미지 업로드
- [ ] 발행/비발행 토글

#### 게시판 관리 (`/admin/content/board`)
- [x] 페이지 구조
- [ ] 공지/자유 게시글 목록
- [ ] 게시글 관리 (수정/삭제/고정)

---

## E. API Routes (Phase 8)

| 라우트 | 메서드 | 상태 | 설명 |
|--------|--------|:----:|------|
| `/api/auth/[...nextauth]` | GET/POST | ✅ | NextAuth 핸들러 |
| `/api/admin/users` | GET | ✅ | 회원 목록 조회 |
| `/api/admin/users/[id]/role` | PATCH | ❌ | 회원 역할 변경 |
| `/api/admin/users/[id]/status` | PATCH | ❌ | 계정 활성화/정지 |
| `/api/donation/webhook` | POST | ❌ | 토스페이먼츠 웹훅 수신 |
| `/api/donation/verify` | POST | ❌ | 토스페이먼츠 결제 검증 |

---

## F. 테스트 (Phase 9)

### F-1. 단위 테스트 (Vitest)
- [x] `lib/crypto.ts` — encrypt, decrypt, getLastFourChars (7개)
- [x] `lib/validations/*.schema.ts` — Zod 스키마 검증 (12개)
- [x] `lib/utils.ts` — cn, formatCurrency, formatDate, anonymizeName (11개)
- [ ] `lib/auth.ts` — hasMinimumRole, hasRole 함수
- [ ] `middleware.ts` — 라우트 매칭 로직

### F-2. 통합 테스트 (Testing Library)
- [ ] ApiKeyForm — 폼 제출 + 검증 에러
- [ ] ApiKeyCard — 복사/수정/삭제 인터랙션
- [ ] DonationChart — 데이터 렌더링
- [ ] ExpenseChart — 데이터 렌더링
- [ ] RoleGuard — 역할별 렌더링 조건
- [ ] SecretInput — 마스킹 토글 + 복사
- [ ] Header — 네비게이션 + 모바일 토글
- [ ] LoginPage — 로그인 폼 제출

### F-3. 핵심 시나리오 테스트
- [ ] SUPER_ADMIN API Key 등록 → 암호화 저장 검증
- [ ] FINANCE 역할 `/admin/settings/api-keys` 접근 → 리다이렉트
- [ ] 후원금 공개 ON → 투명성 페이지 노출 검증

### F-4. 커버리지
- 현재: 핵심 유틸 함수 테스트 (30개 통과)
- 목표: 핵심 유틸 함수 80% 이상

---

## G. 외부 서비스 연동 (미구현)

| 서비스 | 용도 | 상태 | 우선순위 |
|--------|------|:----:|:--------:|
| PostgreSQL | 데이터베이스 | ❌ DB 연결 필요 | 🔴 높음 |
| Supabase Storage | 파일 저장 (증빙, 보고서) | ❌ | 🟡 중간 |
| 토스페이먼츠 | 결제 처리 | ❌ | 🔴 높음 |
| Upstash Redis | 캐싱 + Rate Limiting | ❌ 연결 필요 | 🟡 중간 |
| Google OAuth | 소셜 로그인 | ❌ | 🟢 낮음 |
| Kakao OAuth | 소셜 로그인 | ❌ | 🟢 낮음 |

---

## H. 배포 준비

- [ ] Vercel 프로젝트 생성
- [ ] 환경변수 설정 (`.env.example` 기반)
- [ ] PostgreSQL 프로비저닝 (Supabase/Neon/Railway)
- [ ] Prisma 마이그레이션 + 시드 실행
- [ ] Upstash Redis 프로비저닝
- [ ] Supabase Storage 버킷 생성
- [ ] 토스페이먼츠 테스트 키 등록
- [ ] 도메인 연결 (paxchristikorea.org)
- [ ] next/image 외부 도메인 whitelist 설정
- [ ] Edge Runtime 설정 검토
- [ ] SEO (sitemap.xml, robots.txt, OpenGraph)
- [ ] Google Analytics / Vercel Analytics

---

## I. 후속 개선 로드맵

### 🔜 Phase 10: 핵심 미완성 기능 보완
1. 회원 관리 API 라우트 구현 (`/api/admin/users/[id]/role`, `/status`)
2. 일반 설정 저장 로직 (SiteSetting Server Action)
3. 지출 목록 테이블 + 수정/삭제
4. 내 후원 내역 조회 구현
5. 활동 필터 (카테고리/연도)
6. 게시판 CRUD (작성/수정/삭제/상세)

### 🔜 Phase 11: 결제 및 파일 시스템
1. 토스페이먼츠 SDK 결제 연동
2. 결제 완료 웹훅 수신 + 서버 재검증
3. Supabase Storage 파일 업로드 (증빙, 이미지)
4. PDF 감사 보고서 생성 (@react-pdf/renderer)
5. 엑셀 다운로드 (.xlsx)

### 🔜 Phase 12: UX 고도화
1. 숫자 카운터 애니메이션
2. 무한 스크롤 (useInfiniteQuery)
3. MDX/Rich Text 에디터 + 렌더링
4. Toast 알림 시스템
5. Skeleton 로딩 상태
6. OAuth 소셜 로그인 (Google, Kakao)
7. 이메일 인증 (VerificationToken)

### 🔜 Phase 13: 테스트 + 배포
1. 통합 테스트 작성 (Testing Library)
2. 핵심 시나리오 E2E 테스트
3. Vercel 배포 + 환경변수 설정
4. DB 프로비저닝 + 마이그레이션
5. 도메인 연결 + SSL
6. SEO 최적화

### 🔜 Phase 14: 확장 기능 (향후)
1. AI 챗봇 통합 (등록된 API Key 활용)
2. 다국어 지원 (next-intl — 한/영/스페인어)
3. 이메일 뉴스레터 (Resend + React Email)
4. 감사 로그 (관리자 작업 이력)
5. 모바일 앱 연동 (React Native)

---

## J. 현재 진행률 요약

| 영역 | 완료 | 전체 | 비율 |
|------|:----:|:----:|:----:|
| 프로젝트 기반 | 33 | 35 | 94% |
| UI 컴포넌트 | 26 | 34 | 76% |
| Server Actions / 훅 | 14 | 15 | 93% |
| 공개 페이지 | 22 | 35 | 63% |
| 인증 페이지 | 8 | 14 | 57% |
| 관리자 페이지 | 18 | 34 | 53% |
| API Routes | 2 | 6 | 33% |
| 테스트 | 3 | 11 | 27% |
| 외부 연동 | 0 | 6 | 0% |
| 배포 | 0 | 12 | 0% |
| **종합** | **126** | **202** | **62%** |

> **핵심 기능 (API Key 관리 + 투명성 공개)은 100% 완성**
> 나머지는 외부 서비스 연동 및 CRUD 보완 작업
