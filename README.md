# 멜로디버그 홈페이지

Next.js 16 + Supabase + KG이니시스 + Vercel

## 구조

| 경로 | 설명 |
|---|---|
| `/` | 메인 (소개, 가격, 주문전 필독, 경력, 포트폴리오) |
| `/order?plan=short\|medium\|large` | 주문서 → 이니시스 결제창 |
| `/order/complete`, `/order/fail` | 결제 결과 |
| `/admin` | 결제 내역 (관리자 로그인 필요) |
| `/api/orders` | 주문 생성 (금액은 서버에서 결정) |
| `/api/inicis/return` | PC 결제 승인 처리 |
| `/api/inicis/mobile-return` | 모바일 결제 승인 처리 |

- 문구 수정: `src/lib/content.ts`
- 가격 수정: `src/lib/plans.ts`
- 스타일: `src/app/globals.css`

## 처음 세팅

1. **Supabase** 프로젝트 생성 → SQL Editor 에서 `supabase/schema.sql` 실행
2. Supabase > Authentication > Users > **Add user** 로 관리자 계정 생성
3. `.env.example` 을 `.env.local` 로 복사하고 값 채우기
4. 실행
   ```bash
   npm install
   npm run dev
   ```

## 결제 테스트

`.env.local` 의 이니시스 값을 테스트 값(`INIpayTest`)으로 두면 실제 돈이 나가지 않습니다.
테스트 결제는 이니시스가 returnUrl 로 접근해야 하므로 **Vercel 에 배포한 주소**에서 하는 것이 가장 편합니다.

## 배포 (Vercel)

1. GitHub 에 올리고 Vercel 에서 Import
2. Vercel > Settings > Environment Variables 에 `.env.local` 값 입력
   (`NEXT_PUBLIC_SITE_URL` 은 배포 주소로)
3. 테스트 결제 확인 후 → 실제 MID / signKey 로 교체, `INICIS_TEST=false`
4. 도메인 연결: Vercel > Domains 에 `melodybug.co.kr` 추가 → 도메인 업체 DNS 변경

## 환불

KG이니시스 가맹점 관리자에서 환불 → `/admin` 에서 해당 주문 **취소 처리** 클릭
