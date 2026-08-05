# 📁 파일 경로: docs/SECURITY_INCIDENT_RLS.md

# 보안 대응: Supabase RLS 미설정으로 인한 데이터 노출 취약점

## 1. 경위

2026-08-03 Supabase 보안 검사(Security Advisor)가 프로젝트 `pck-홈페이지`
(ref: `bsccnnpebrxuinymziyn`)에서 다음 두 건의 **Critical** 취약점을 자동 통보함.

| 항목 | 내용 |
|---|---|
| `rls_disabled_in_public` | `public` 스키마 테이블에 Row Level Security(RLS)가 비활성화되어, 프로젝트 URL을 아는 누구나 PostgREST API로 해당 테이블의 모든 데이터를 읽기/수정/삭제 가능 |
| 민감 데이터 노출 | 비밀번호/개인식별정보 등 민감 컬럼을 포함한 테이블이 API를 통해 접근 제한 없이 노출 |

## 2. 원인

- 본 프로젝트는 Prisma ORM으로 Supabase Postgres에 직접 접속하여 DB를 다룬다
  (`prisma/schema.prisma`, `DATABASE_URL`). Supabase는 `public` 스키마의 모든
  테이블을 PostgREST를 통해 자동으로 REST API로도 노출하는데, RLS가 꺼져
  있으면 이 자동 API 경로가 무방비 상태가 된다.
- Prisma로 테이블을 생성/관리(`db:push`)하는 과정에서 RLS를 별도로 켜지
  않았기 때문에 모든 테이블이 기본값(RLS 비활성화) 그대로 방치되어 있었다.

### 영향받은 테이블과 민감도

| 테이블 | 민감 데이터 | 위험도 |
|---|---|---|
| `User` | `password`(해시), 이메일, 역할(`role`) | 높음 |
| `ApiKeyConfig` | 제3자 서비스 API 키의 암호문(`encryptedValue/Iv/Tag`) | 높음 |
| `Donation` | 후원자 이름/이메일, `paymentKey` | 높음 |
| `Account`, `Session` | OAuth 토큰, 세션 토큰 | 높음 |
| `Expense`, `FinanceReport`, `Activity`, `BoardPost`, `SiteSetting`, `VerificationToken` | 내부 운영/콘텐츠 데이터 | 중간 |

## 3. 조치

`supabase/migrations/20260805000000_enable_rls_all_public_tables.sql` 추가:

- `public` 스키마의 모든 테이블에 대해 `ENABLE ROW LEVEL SECURITY` 실행.
- 정책(policy)은 의도적으로 하나도 추가하지 않음 → **기본 거부(deny-all)**.
- 앱은 Prisma가 Supabase의 관리자(superuser급) 역할로 직접 접속해 RLS를
  우회하므로 **애플리케이션 동작에는 영향 없음**. 반대로 PostgREST가 쓰는
  `anon`/`authenticated` 역할은 정책이 없으므로 어떤 행도 반환받지 못한다.

### 적용 방법 (Supabase 프로젝트에 실제 반영하는 단계 — 수동 실행 필요)

이 마이그레이션 파일은 저장소에만 커밋되며, **Supabase 프로젝트 DB에는
자동으로 반영되지 않는다.** 아래 중 한 가지 방법으로 직접 실행해야 한다.

1. Supabase 대시보드 → 해당 프로젝트 → **SQL Editor** → 마이그레이션
   파일 내용을 붙여넣고 실행, 또는
2. Supabase CLI가 연결되어 있다면 `supabase db push`

적용 후 Supabase 대시보드 → **Advisors → Security Advisor**에서
`rls_disabled_in_public` 및 민감 데이터 노출 경고가 사라졌는지 확인한다.

## 4. 후속 권고 사항 (필수 검토)

RLS가 비활성화된 기간 동안 실제로 외부에서 anon 키로 데이터를 조회했을
가능성을 배제할 수 없으므로, 아래를 함께 점검/조치할 것을 권고한다.

- [ ] Supabase 대시보드 → **Logs → API Logs**에서 `anon`/`authenticated`
      역할로 `User`, `ApiKeyConfig`, `Donation`, `Account`, `Session`
      테이블에 대한 비정상 조회 이력이 있었는지 확인
- [ ] 위 로그에서 유출 징후가 확인되면:
  - `User.password` — 전체 사용자 비밀번호 재설정 강제
  - `ApiKeyConfig` — 암호화에 쓰인 `ENCRYPTION_MASTER_KEY` 및 저장된
    제3자 API 키(Toss 등) 회전
  - `NEXTAUTH_SECRET` 회전 (세션 위조 방지)
- [ ] Supabase 프로젝트의 `anon` / `service_role` API 키 자체도 노출
      이력이 있다면 대시보드에서 재발급(rotate) 고려
- [ ] 향후 신규 테이블 추가 시 RLS를 기본으로 켜고 정책을 명시하는 것을
      배포 체크리스트(`check.md`)에 반영

## 5. 재발 방지

- 새 테이블을 Prisma로 추가한 뒤에는 반드시 이 디렉터리(`supabase/migrations/`)에
  해당 테이블의 `ENABLE ROW LEVEL SECURITY` 구문을 함께 추가한다.
- Supabase Storage 등 브라우저에서 직접 Supabase API를 호출하는 기능을
  도입할 경우, 그 테이블/버킷에 한해 최소 권한 정책을 명시적으로 작성한다
  (예시는 마이그레이션 파일 하단 주석 참고).
