-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.

create table if not exists public.orders (
  id            uuid primary key default gen_random_uuid(),
  order_no      text not null unique,             -- 주문번호 (이니시스 oid)
  plan_id       text not null,                    -- short / medium / large
  product_name  text not null,
  amount        integer not null check (amount > 0),
  buyer_name    text not null,
  buyer_phone   text not null,
  buyer_email   text not null,
  memo          text,                             -- 요청사항
  status        text not null default 'pending'
                check (status in ('pending', 'paid', 'failed', 'cancelled')),
  pay_method    text,                             -- 결제수단
  pg_tid        text,                             -- 이니시스 거래번호 (환불 시 사용)
  pg_result_msg text,
  paid_at       timestamptz,
  created_at    timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);

-- RLS 켜고 정책은 만들지 않음 → 브라우저(anon 키)에서는 접근 불가,
-- 서버의 service_role 키로만 읽고 쓸 수 있음.
alter table public.orders enable row level security;

-- 관리자 계정: Supabase 대시보드 > Authentication > Users > "Add user" 로 이메일/비밀번호 계정을 만들고,
-- 그 이메일을 환경변수 ADMIN_EMAILS 에 넣으세요. (별도 admins 테이블 불필요)

-- 수량 / 추가옵션 (이미 테이블을 만들었다면 아래 두 줄만 실행)
alter table public.orders add column if not exists quantity integer not null default 1;
alter table public.orders add column if not exists extra_count integer not null default 0;
