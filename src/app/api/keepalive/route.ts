import { supabaseAdmin } from "@/lib/supabase-admin";

// Supabase 무료 플랜은 7일간 사용이 없으면 일시정지된다.
// Vercel Cron(vercel.json)이 하루 한 번 이 주소를 호출해 DB를 가볍게 조회한다.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { error } = await supabaseAdmin().from("orders").select("order_no").limit(1);
  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
