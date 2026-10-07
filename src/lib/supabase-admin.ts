import "server-only";
import { createClient } from "@supabase/supabase-js";

// service role 키를 쓰는 서버 전용 클라이언트 (RLS 우회). 절대 클라이언트 코드에서 import 금지.
export function supabaseAdmin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
}

export type OrderRow = {
  id: string;
  order_no: string;
  plan_id: string;
  product_name: string;
  amount: number;
  buyer_name: string;
  buyer_phone: string;
  buyer_email: string;
  memo: string | null;
  status: "pending" | "paid" | "failed" | "cancelled";
  pay_method: string | null;
  pg_tid: string | null;
  pg_result_msg: string | null;
  paid_at: string | null;
  created_at: string;
};
