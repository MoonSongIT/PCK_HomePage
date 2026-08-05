-- 📁 파일 경로: supabase/migrations/20260805000000_enable_rls_all_public_tables.sql
--
-- 목적: Supabase 보안 검사(Security Advisor)가 리포트한 취약점 해결
--   1) rls_disabled_in_public — public 스키마 테이블에 RLS가 꺼져 있어
--      프로젝트 URL + anon 키만 있으면 누구나 PostgREST API로 모든 행을
--      읽기/수정/삭제할 수 있는 상태였음.
--   2) 민감한 컬럼 노출 — User.password, ApiKeyConfig.encryptedValue 등
--      민감 정보를 담은 테이블도 동일하게 무방비로 노출되어 있었음.
--
-- 배경: 이 프로젝트는 Prisma가 Supabase Postgres에 "postgres" 관리자 역할로
--   직접 접속하여 모든 DB 작업을 수행한다 (app/, server/ 코드에서
--   supabase-js 클라이언트를 통한 접근은 사용하지 않음). 관리자 역할은
--   RLS를 우회(bypass)하므로, 아래처럼 RLS를 켜고 정책을 하나도 만들지
--   않아도(= 기본 거부) Prisma/앱 동작에는 영향이 없다. 반대로 PostgREST가
--   사용하는 anon/authenticated 역할은 RLS가 켜진 테이블에서 정책이 없으면
--   아무 행도 반환하지 않으므로, 이번 취약점이 완전히 차단된다.
--
-- 적용 방법:
--   A) Supabase 대시보드 > SQL Editor 에 이 파일 내용을 붙여넣고 실행, 또는
--   B) Supabase CLI 사용 시: supabase db push (마이그레이션 자동 적용)
--
-- 적용 후 확인:
--   Supabase 대시보드 > Advisors > Security Advisor 에서
--   "rls_disabled_in_public" / 민감 데이터 노출 경고가 사라졌는지 확인.
--   앱은 Prisma(관리자 역할)로 접속하므로 정상 동작 그대로 유지되어야 함.

begin;

alter table public."User"               enable row level security;
alter table public."Account"             enable row level security;
alter table public."Session"             enable row level security;
alter table public."VerificationToken"   enable row level security;
alter table public."Donation"            enable row level security;
alter table public."Expense"             enable row level security;
alter table public."ApiKeyConfig"        enable row level security;
alter table public."FinanceReport"       enable row level security;
alter table public."Activity"            enable row level security;
alter table public."BoardPost"           enable row level security;
alter table public."SiteSetting"         enable row level security;

commit;

-- ----------------------------------------------------------------------------
-- 참고: 정책(policy)을 하나도 만들지 않았으므로 위 테이블들은 anon/authenticated
-- 역할에게 "기본 거부(deny-all)" 상태가 된다. 이 프로젝트는 브라우저에서
-- supabase-js로 직접 DB를 조회하지 않고, 모든 조회/쓰기는 Next.js 서버
-- (app/, server/)를 거쳐 Prisma로 처리하므로 이것이 올바른 기본값이다.
--
-- 향후 Supabase Storage(증빙파일 업로드 등, check.md 참고)처럼 브라우저에서
-- 직접 Supabase API를 호출해야 하는 기능을 추가한다면, 그때 필요한 테이블에
-- 한해 최소 권한 정책을 명시적으로 추가할 것. 예시:
--
--   create policy "공개 활동 게시물만 읽기 허용"
--     on public."Activity" for select
--     to anon, authenticated
--     using ("isPublished" = true);
--
-- 처럼 필요한 범위만 "using" 조건으로 좁혀서 추가한다. 절대로 정책 없이
-- RLS를 끄는 방식(rls disabled)으로 되돌리지 말 것.
