# 팍스 크리스티 코리아 홈페이지 — 테스트 가이드

> 최종 업데이트: 2026-03-16
> 대상 브랜치: `claude/pax-christi-website-renewal-cyqQ3`

---

## 목차

1. [사전 준비](#1-사전-준비)
2. [STEP 1: 단위 테스트 실행](#2-step-1-단위-테스트-실행-자동)
3. [STEP 2: 개발 서버 실행](#3-step-2-개발-서버-실행)
4. [STEP 3: 공개 페이지 수동 테스트](#4-step-3-공개-페이지-수동-테스트)
5. [STEP 4: 인증 페이지 테스트](#5-step-4-인증-페이지-테스트)
6. [STEP 5: 관리자 페이지 테스트](#6-step-5-관리자-페이지-테스트)
7. [STEP 6: 미들웨어/보안 테스트](#7-step-6-미들웨어보안-테스트)
8. [STEP 7: 반응형 디자인 테스트](#8-step-7-반응형-디자인-테스트)
9. [STEP 8: 데이터베이스 연동 테스트 (선택)](#9-step-8-데이터베이스-연동-테스트-선택)
10. [알려진 제한사항 및 미구현 기능](#10-알려진-제한사항-및-미구현-기능)
11. [문제 해결 가이드](#11-문제-해결-가이드)

---

## 1. 사전 준비

### 1-1. 필수 환경

| 항목 | 최소 버전 | 확인 명령어 | 현재버전 |
|------|----------|------------|----------|
| Node.js | 18.x 이상 | `node -v` | v22.18.0 |
| npm | 9.x 이상 | `npm -v` | 11.5.2 |
| Git | 2.x 이상 | `git -v` | git version 2.46.0.windows.1 |

### 1-2. 프로젝트 설정

```bash
# 1) 프로젝트 디렉토리로 이동
cd C:\Users\dohay\ClaudeWork\PCK_renewal\

# 2) 의존성 설치
npm install

# 3) 환경변수 파일 생성
copy .env.example .env.local
```

### 1-3. 환경변수 설정 (.env.local)

**최소 필수 항목** (DB 없이 UI만 테스트할 경우):

```env
# NextAuth (필수 — 로그인/미들웨어 동작에 필요)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=test-secret-key-for-development-only-32chars

# 암호화 (필수 — API Key 관련 기능 동작에 필요)
ENCRYPTION_MASTER_KEY=a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2
```

**DB 연동 테스트 시 추가 항목**:

```env
# PostgreSQL (Supabase, Neon, Railway, 또는 로컬)
DATABASE_URL=postgresql://user:password@localhost:5432/pck_homepage

# Upstash Redis (선택)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

### 1-4. Prisma 클라이언트 생성 (필수)

```bash
npm run db:generate
```

> ⚠️ `db:generate`는 DB 연결 없이도 실행 가능합니다. Prisma 타입 생성만 수행합니다.

---

## 2. STEP 1: 단위 테스트 실행 (자동)

### 실행 방법

```bash
# 전체 테스트 한 번 실행
npm test

# 감시 모드 (파일 변경 시 자동 재실행)
npm run test:watch
```

### 기대 결과

```
✓ __tests__/lib/crypto.test.ts (7 tests)
  ✓ 평문 암호화/복호화 정상 작동
  ✓ 동일 평문이 매번 다른 암호문 생성 (랜덤 IV)
  ✓ 빈 문자열 암호화/복호화
  ✓ 긴 문자열(500자) 처리
  ✓ 잘못된 태그로 복호화 시 에러
  ✓ 잘못된 IV로 복호화 시 에러
  ✓ getLastFourChars — 마지막 4자리 추출

✓ __tests__/lib/utils.test.ts (10 tests)
  ✓ formatCurrency — 50000 → "50,000원"
  ✓ formatDate — 한국어 날짜 포맷
  ✓ anonymizeName — "홍길동" → "홍○○"
  ✓ cn — Tailwind 클래스 병합

✓ __tests__/lib/validations.test.ts (13+ tests)
  ✓ apiKeyCreateSchema — 유효/무효 데이터 검증
  ✓ donationCreateSchema — 금액 범위 검증
  ✓ expenseCreateSchema — 카테고리 검증
  ✓ loginSchema / registerSchema — 이메일, 비밀번호 규칙

총 30개 테스트 — 전체 통과 ✅
```

### 체크리스트

- [ ] `npm test` 실행 후 모든 테스트 PASS 확인
- [ ] 실패한 테스트가 있다면 에러 메시지 기록

---

## 3. STEP 2: 개발 서버 실행

```bash
npm run dev
```

### 기대 결과

```
▲ Next.js 15.x (turbo)
- Local:   http://localhost:3000
```

> ⚠️ **DB 미연결 시 주의**: 데이터베이스가 연결되지 않으면 DB를 호출하는 페이지에서 에러가 발생할 수 있습니다.
> 이 경우 **레이아웃, 정적 UI, 라우팅**은 정상 작동하고, **데이터 조회 부분만** 에러가 표시됩니다.

### 체크리스트

- [ ] `npm run dev` 정상 실행 (빌드 에러 없음)
- [ ] `http://localhost:3000` 브라우저 접속 가능
- [ ] 콘솔에 심각한 에러(build error, module not found) 없음

---

## 4. STEP 3: 공개 페이지 수동 테스트

> 아래 각 페이지를 브라우저에서 열어서 확인합니다.

### 4-1. 메인 홈 (`/`)

| 확인 항목 | 기대 결과 | 확인 |
|----------|----------|:----:|
| 페이지 로딩 | 에러 없이 렌더링됨 | ☐ |
| Hero 슬라이드 | 3장 배너가 5초 간격으로 자동 전환 | ☐ |
| CTA 버튼 | "단체 소개" → `/about`, "후원하기" → `/donation` | ☐ |
| 활동 하이라이트 | 카드 3개 표시 (DB 연결 시) | ☐ |
| 교황 메시지 | 인용구 텍스트 표시 | ☐ |
| 숫자로 보는 PCK | 통계 4개 표시 | ☐ |
| 후원 CTA | 배경색 강조 + 금액 바로가기 버튼 | ☐ |

### 4-2. 단체 소개 (`/about`)

| 확인 항목 | 기대 결과 | 확인 |
|----------|----------|:----:|
| 설립 배경 | 텍스트 정상 표시 | ☐ |
| 비전 (성경 인용) | 인용 블록 스타일 적용 | ☐ |
| 핵심 가치 카드 4개 | 아이콘 + 제목 + 설명 | ☐ |

### 4-3. 국제 팍스 크리스티 (`/about/international`)

| 확인 항목 | 기대 결과 | 확인 |
|----------|----------|:----:|
| 소개 텍스트 | 정상 표시 | ☐ |
| 세계 지도 영역 | 플레이스홀더 또는 이미지 영역 | ☐ |

### 4-4. 임원 소개 (`/about/members`)

| 확인 항목 | 기대 결과 | 확인 |
|----------|----------|:----:|
| 프로필 카드 | 이름, 직책, 인사말 카드 | ☐ |
| 반응형 | 모바일에서 1열, 데스크톱에서 2~3열 | ☐ |

### 4-5. 활동 소식 (`/activities`)

| 확인 항목 | 기대 결과 | 확인 |
|----------|----------|:----:|
| 카드 그리드 | 1→2→3열 반응형 레이아웃 | ☐ |
| 카테고리 Badge | 색상별 Badge 표시 | ☐ |
| 카드 클릭 | `/activities/[slug]` 상세 페이지 이동 | ☐ |

### 4-6. 게시판 (`/board/notice`, `/board/free`)

| 확인 항목 | 기대 결과 | 확인 |
|----------|----------|:----:|
| 공지사항 테이블 | 제목, 작성일, 조회수 컬럼 | ☐ |
| 고정 글 Badge | 📌 또는 "고정" Badge | ☐ |
| 자유게시판 테이블 | 같은 구조의 테이블 표시 | ☐ |

### 4-7. 후원 안내 (`/donation`)

| 확인 항목 | 기대 결과 | 확인 |
|----------|----------|:----:|
| 금액 프리셋 | 5종 금액 버튼 (클릭 시 선택 상태) | ☐ |
| 직접 입력 | 금액 직접 입력 가능 | ☐ |
| 정기/일시 토글 | 스위치 동작 | ☐ |
| 후원자 정보 | 이름, 이메일 입력 필드 | ☐ |
| 결제 버튼 | UI 존재 (토스페이먼츠 미연동 상태) | ☐ |

### 4-8. 투명성 공개 (`/transparency`)

| 확인 항목 | 기대 결과 | 확인 |
|----------|----------|:----:|
| 연도별 탭 | 최근 5년 탭 전환 | ☐ |
| 요약 카드 4개 | 수입/지출/잔액/후원자 수 | ☐ |
| 월별 차트 (BarChart) | Recharts 막대 차트 렌더링 | ☐ |
| 카테고리 차트 (PieChart) | Recharts 도넛 차트 렌더링 | ☐ |
| 상세 테이블 | 수입/지출 내역 행 표시 | ☐ |

### 4-9. 자료실 (`/resources`)

| 확인 항목 | 기대 결과 | 확인 |
|----------|----------|:----:|
| "준비 중" 안내 | 플레이스홀더 메시지 표시 | ☐ |

---

## 5. STEP 4: 인증 페이지 테스트

### 5-1. 회원가입 (`/register`)

| 확인 항목 | 기대 결과 | 확인 |
|----------|----------|:----:|
| 폼 렌더링 | 이름, 이메일, 비밀번호, 비밀번호 확인 필드 | ☐ |
| 빈 폼 제출 | 필수 항목 에러 메시지 | ☐ |
| 비밀번호 불일치 | "비밀번호가 일치하지 않습니다" 에러 | ☐ |
| 짧은 비밀번호 (7자) | "8자 이상" 에러 메시지 | ☐ |
| 영문만 비밀번호 | "영문+숫자" 에러 메시지 | ☐ |
| 정상 가입 (DB 연결 시) | 성공 → 로그인 페이지 이동 | ☐ |

### 5-2. 로그인 (`/login`)

| 확인 항목 | 기대 결과 | 확인 |
|----------|----------|:----:|
| 폼 렌더링 | 이메일, 비밀번호 필드 | ☐ |
| 빈 폼 제출 | 에러 메시지 | ☐ |
| 회원가입 링크 | `/register` 이동 | ☐ |
| 잘못된 자격증명 | 에러 메시지 표시 | ☐ |
| 정상 로그인 (DB 연결 시) | 성공 → 메인 페이지 이동 | ☐ |

**테스트 계정** (DB 시드 실행 후):

| 역할 | 이메일 | 비밀번호 |
|------|--------|---------|
| SUPER_ADMIN | `admin@paxchristikorea.org` | `admin1234` |
| MEMBER | `member@example.com` | `member1234` |

### 5-3. 마이페이지 (`/mypage`)

| 확인 항목 | 기대 결과 | 확인 |
|----------|----------|:----:|
| 비로그인 접근 | → `/login` 리다이렉트 | ☐ |
| 로그인 후 접근 | 개인 정보 카드 (이름, 이메일, 역할) | ☐ |
| 후원 바로가기 | `/mypage/donations` 링크 | ☐ |

---

## 6. STEP 5: 관리자 페이지 테스트

> ⚠️ 관리자 페이지는 로그인 + 역할 권한이 필요합니다.
> `admin@paxchristikorea.org` / `admin1234` 계정으로 로그인 후 테스트하세요.

### 6-1. 대시보드 (`/admin/dashboard`)

| 확인 항목 | 기대 결과 | 확인 |
|----------|----------|:----:|
| KPI 카드 4개 | 이번달 수입/지출, 누적 잔액, 신규 후원자 | ☐ |
| 월별 차트 | BarChart (Recharts) 렌더링 | ☐ |
| 사이드바 메뉴 | 역할에 따른 메뉴 표시 | ☐ |

### 6-2. 후원 내역 관리 (`/admin/finance/donations`)

| 확인 항목 | 기대 결과 | 확인 |
|----------|----------|:----:|
| 검색 | 후원자명 검색 필드 | ☐ |
| 테이블 | 날짜/후원자/금액/방식/결제수단/공개/상태 | ☐ |
| 공개 토글 | Switch 컴포넌트 (투명성 페이지 노출) | ☐ |
| 페이지네이션 | 페이지 이동 버튼 | ☐ |

### 6-3. 지출 내역 관리 (`/admin/finance/expenses`)

| 확인 항목 | 기대 결과 | 확인 |
|----------|----------|:----:|
| 등록 버튼 | "지출 등록" 버튼 → 모달 오픈 | ☐ |
| 등록 모달 | 제목, 금액, 카테고리(5종), 날짜, 설명, 공개 여부 | ☐ |
| 카테고리 선택 | PEACE_EDUCATION/CAMPAIGN/INTERNATIONAL/OPERATIONS/RESERVE | ☐ |
| 검증 에러 | 빈 필드 제출 시 Zod 에러 메시지 | ☐ |

### 6-4. API Key 관리 (`/admin/settings/api-keys`) ⭐ 핵심 기능

| 확인 항목 | 기대 결과 | 확인 |
|----------|----------|:----:|
| 카드 그리드 | API Key 목록 카드 표시 | ☐ |
| 마스킹 | Key 값이 `****XXXX` 형태로 표시 (마지막 4자리만) | ☐ |
| 새 API Key 등록 | 모달 → 서비스명, 식별자, 키값, 설명 입력 | ☐ |
| 식별자 규칙 | 대문자+숫자+언더스코어만 허용 (예: OPENAI_API_KEY) | ☐ |
| 활성/비활성 Badge | 상태 표시 | ☐ |
| 복사 버튼 | 마지막 4자리 클립보드 복사 | ☐ |
| 수정 | 수정 모달 → 키값 재입력 방식 | ☐ |
| 삭제 | 확인 Dialog → 삭제 실행 | ☐ |

### 6-5. 일반 설정 (`/admin/settings/general`)

| 확인 항목 | 기대 결과 | 확인 |
|----------|----------|:----:|
| 사이트 정보 폼 | 사이트명, 이메일, 주소 입력 필드 | ☐ |
| 소셜 링크 | Facebook, Instagram, YouTube URL 필드 | ☐ |
| 후원 목표액 | 금액 입력 필드 | ☐ |
| 저장 버튼 | UI 존재 (저장 로직 미구현 상태) | ☐ |

### 6-6. 회원 관리 (`/admin/users`)

| 확인 항목 | 기대 결과 | 확인 |
|----------|----------|:----:|
| 회원 테이블 | 이름/이메일/역할/가입일/상태 | ☐ |
| 검색 | 이름/이메일 검색 필드 | ☐ |
| 역할 변경 드롭다운 | 역할 선택 UI (API 미구현) | ☐ |
| 계정 정지 토글 | Switch UI (API 미구현) | ☐ |

### 6-7. 콘텐츠 관리

| 페이지 | 확인 항목 | 확인 |
|--------|----------|:----:|
| `/admin/content/activities` | 플레이스홀더 표시 | ☐ |
| `/admin/content/board` | 플레이스홀더 표시 | ☐ |
| `/admin/finance/reports` | 플레이스홀더 표시 | ☐ |

---

## 7. STEP 6: 미들웨어/보안 테스트

### 7-1. 인증 보호 테스트

| 시나리오 | 테스트 방법 | 기대 결과 | 확인 |
|---------|-----------|----------|:----:|
| 비로그인 → `/admin/dashboard` | URL 직접 입력 | → `/login?callbackUrl=...` 리다이렉트 | ☐ |
| 비로그인 → `/mypage` | URL 직접 입력 | → `/login?callbackUrl=...` 리다이렉트 | ☐ |
| 로그인 상태 → `/login` | URL 직접 입력 | → `/` 메인으로 리다이렉트 | ☐ |
| 로그인 상태 → `/register` | URL 직접 입력 | → `/` 메인으로 리다이렉트 | ☐ |

### 7-2. 역할 기반 접근 제어 (RBAC) 테스트

> DB 연결 + 시드 데이터 필요

| 시나리오 | 테스트 방법 | 기대 결과 | 확인 |
|---------|-----------|----------|:----:|
| MEMBER → `/admin/dashboard` | member 계정 로그인 후 접근 | → 리다이렉트 (접근 거부) | ☐ |
| MEMBER → `/admin/settings/api-keys` | member 계정 로그인 후 접근 | → 리다이렉트 (접근 거부) | ☐ |
| SUPER_ADMIN → `/admin/settings/api-keys` | admin 계정 로그인 후 접근 | ✅ 정상 접근 | ☐ |
| SUPER_ADMIN → `/admin/users` | admin 계정 로그인 후 접근 | ✅ 정상 접근 | ☐ |

### 7-3. 권한 매트릭스 참조

| 경로 | SUPER_ADMIN | ADMIN | FINANCE | MEMBER | GUEST |
|------|:---:|:---:|:---:|:---:|:---:|
| `/admin/settings/api-keys` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `/admin/users` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `/admin/finance/*` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `/admin/dashboard` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `/mypage` | ✅ | ✅ | ✅ | ✅ | ❌ |

---

## 8. STEP 7: 반응형 디자인 테스트

### 브라우저 DevTools 사용

```
Chrome: F12 → Toggle Device Toolbar (Ctrl+Shift+M)
```

### 확인 브레이크포인트

| 디바이스 | 너비 | 확인 사항 |
|---------|------|---------|
| 모바일 (iPhone SE) | 375px | 하단 MobileNav 표시, 1열 레이아웃, 햄버거 메뉴 |
| 모바일 (iPhone 14) | 390px | 위와 동일 |
| 태블릿 (iPad) | 768px | 2열 그리드, 헤더 변화 |
| 데스크톱 | 1024px+ | 전체 네비게이션, 3열 그리드, 사이드바 |
| 와이드 | 1440px+ | 최대 너비 제한, 중앙 정렬 |

### 페이지별 반응형 체크리스트

| 페이지 | 모바일 확인 항목 | 확인 |
|--------|----------------|:----:|
| 메인 홈 | Hero 텍스트 가독성, CTA 버튼 터치 영역 | ☐ |
| 활동 소식 | 1열 카드 레이아웃 | ☐ |
| 게시판 | 테이블 가로 스크롤 | ☐ |
| 후원 안내 | 금액 버튼 2~3열 wrap | ☐ |
| 투명성 공개 | 차트 축소/스크롤, 탭 가로 스크롤 | ☐ |
| 관리자 | 사이드바 → 햄버거 전환 | ☐ |

---

## 9. STEP 8: 데이터베이스 연동 테스트 (선택)

> ⚠️ PostgreSQL 데이터베이스가 준비된 경우에만 진행하세요.

### 9-1. DB 프로비저닝 옵션

| 서비스 | 무료 티어 | 설정 난이도 |
|--------|----------|:---------:|
| [Supabase](https://supabase.com) | 500MB | ⭐ 쉬움 |
| [Neon](https://neon.tech) | 512MB | ⭐ 쉬움 |
| [Railway](https://railway.app) | $5 크레딧 | ⭐⭐ 보통 |
| 로컬 PostgreSQL | 무제한 | ⭐⭐⭐ 직접 설치 |

### 9-2. DB 연결 및 마이그레이션

```bash
# 1) .env.local에 DATABASE_URL 설정 후

# 2) 스키마를 DB에 적용 (개발용 — 마이그레이션 파일 생성 안 함)
npm run db:push

# 3) 시드 데이터 삽입 (관리자 + 회원 계정)
npm run db:seed
```

### 9-3. DB 연동 확인 체크리스트

| 확인 항목 | 테스트 방법 | 확인 |
|----------|-----------|:----:|
| 스키마 적용 | `db:push` 성공 메시지 | ☐ |
| 시드 데이터 | `db:seed` 성공 메시지 | ☐ |
| 관리자 로그인 | `admin@paxchristikorea.org` / `admin1234` | ☐ |
| 회원 로그인 | `member@example.com` / `member1234` | ☐ |
| 회원가입 | 새 계정 가입 → DB 저장 | ☐ |
| 활동 목록 | `/activities` 페이지 데이터 표시 | ☐ |
| 공지사항 | `/board/notice` 테이블 데이터 표시 | ☐ |
| 투명성 페이지 | `/transparency` 차트 데이터 표시 | ☐ |
| API Key 등록 | 관리자 → API Key 등록 → 목록 갱신 | ☐ |
| 후원 내역 | `/admin/finance/donations` 데이터 표시 | ☐ |

### 9-4. Prisma Studio (DB 직접 확인)

```bash
npx prisma studio
```

> 브라우저에서 `http://localhost:5555`로 DB 테이블을 직접 열람/수정할 수 있습니다.

---

## 10. 알려진 제한사항 및 미구현 기능

### ❌ 동작하지 않는 기능 (외부 서비스 미연동)

| 기능 | 이유 | 영향 범위 |
|------|------|---------|
| 토스페이먼츠 결제 | SDK 미연동 | `/donation` 결제 버튼 동작 안 함 |
| Google/Kakao OAuth | 클라이언트 ID 미설정 | 소셜 로그인 버튼 동작 안 함 |
| Redis Rate Limiting | Upstash 미연결 | Rate limit 미적용 |
| 파일 업로드 | Supabase Storage 미연결 | 이미지/증빙 업로드 안 됨 |

### ⚠️ UI만 구현된 기능 (Server Action / API 미완성)

| 기능 | 현재 상태 |
|------|----------|
| 회원 역할 변경 | UI 동작, API Route 미구현 (`/api/admin/users/[id]/role`) |
| 회원 계정 정지 | UI 동작, API Route 미구현 (`/api/admin/users/[id]/status`) |
| 일반 설정 저장 | 폼 UI 완성, 저장 Server Action 없음 |
| 지출 목록 조회 | 등록 모달만 완성, 목록 표시 미완성 |
| 보고서 생성 (PDF) | 플레이스홀더만 존재 |
| 활동 게시물 관리 | 플레이스홀더만 존재 |
| 게시판 관리 | 플레이스홀더만 존재 |
| 내 후원 내역 | 플레이스홀더만 존재 |

### ✅ 완전 동작하는 핵심 기능

| 기능 | 비고 |
|------|------|
| API Key CRUD | 암호화 저장/조회/수정/삭제 전체 |
| 투명성 공개 | 차트 + 테이블 + 연도별 탭 |
| 인증 (Credentials) | 회원가입, 로그인, 세션 관리 |
| RBAC 미들웨어 | 5단계 역할 기반 라우트 보호 |
| 후원 내역 관리 (관리자) | 검색, 공개 토글, 페이지네이션 |

---

## 11. 문제 해결 가이드

### Q1. `npm run dev` 실행 시 모듈 에러

```
Error: Cannot find module '@prisma/client'
```

**해결:**
```bash
npm run db:generate
```

---

### Q2. Prisma 관련 에러

```
Error: Can't reach database server
```

**해결:**
- `.env.local`의 `DATABASE_URL` 확인
- DB 서버 실행 여부 확인
- DB 없이 UI만 테스트하려면, DB 호출 페이지에서 에러가 표시되는 것은 정상

---

### Q3. NextAuth 에러

```
[auth][error] MissingSecret
```

**해결:**
- `.env.local`에 `NEXTAUTH_SECRET` 설정 확인:
```env
NEXTAUTH_SECRET=any-random-string-at-least-32-characters
```

---

### Q4. 포트 충돌

```
Error: listen EADDRINUSE: address already in use :::3000
```

**해결:**
```bash
# 다른 포트로 실행
npx next dev -p 3001
```

---

### Q5. 테스트 실행 시 환경변수 에러

```
Error: ENCRYPTION_MASTER_KEY is not defined
```

**해결:** 테스트는 자체적으로 `beforeAll`에서 환경변수를 설정하므로 정상 작동해야 합니다.
그래도 에러 발생 시 `.env.local`에 값을 추가하세요.

---

### Q6. TypeScript 타입 에러 (빌드 시)

```bash
# 타입 검사만 실행
npx tsc --noEmit
```

---

## 빠른 테스트 체크리스트 (요약)

```
[ ] npm install 완료
[ ] npm run db:generate 완료
[ ] npm test → 30개 전체 PASS
[ ] npm run dev → 서버 정상 시작
[ ] / (메인 홈) 렌더링 확인
[ ] /about 페이지 렌더링 확인
[ ] /login 폼 렌더링 + 유효성 검증 확인
[ ] /register 폼 렌더링 + 유효성 검증 확인
[ ] /donation 후원 UI 확인
[ ] /transparency 차트 렌더링 확인
[ ] 비로그인 → /admin 접근 시 리다이렉트 확인
[ ] 모바일 반응형 레이아웃 확인
[ ] (DB 연결 시) 로그인 → 관리자 페이지 접근 확인
[ ] (DB 연결 시) API Key CRUD 전체 동작 확인
```
