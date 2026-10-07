import { approveMobilePay, isTrustedInicisUrl } from "@/lib/inicis";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { finishRedirect } from "../shared";

// 모바일 결제: 인증 완료 후 이니시스가 P_NEXT_URL 로 POST 한다
export async function POST(req: Request) {
  const form = await req.formData();
  const get = (k: string) => (form.get(k) as string | null) ?? "";

  const status = get("P_STATUS");
  const reqUrl = get("P_REQ_URL");
  const tid = get("P_TID");
  // 인증 단계에서는 P_NOTI 에 주문번호가 오지 않으므로 승인 응답의 P_OID 를 사용
  if (status !== "00" || !isTrustedInicisUrl(reqUrl)) {
    return finishRedirect(`/order/fail`);
  }

  let result: Record<string, string>;
  try {
    result = await approveMobilePay(reqUrl, tid);
  } catch (e) {
    console.error("inicis mobile approve error", e);
    return finishRedirect(`/order/fail`);
  }

  const oid = result.P_OID ?? "";
  const db = supabaseAdmin();

  if (result.P_STATUS !== "00") {
    if (oid) await db.from("orders").update({ status: "failed", pg_result_msg: result.P_RMESG1 ?? "승인 실패" }).eq("order_no", oid).eq("status", "pending");
    return finishRedirect(`/order/fail?oid=${encodeURIComponent(oid)}`);
  }

  const { data: order } = await db.from("orders").select("*").eq("order_no", oid).single();
  if (!order) return finishRedirect(`/order/fail`);

  if (Number(result.P_AMT) !== order.amount) {
    // 모바일은 망취소 API가 별도 — 관리자 확인이 필요하도록 기록만 남긴다
    await db.from("orders").update({ status: "failed", pg_tid: result.P_TID, pg_result_msg: `금액 불일치(${result.P_AMT}) - 이니시스에서 취소 필요` }).eq("order_no", oid);
    return finishRedirect(`/order/fail?oid=${encodeURIComponent(oid)}`);
  }

  await db
    .from("orders")
    .update({
      status: "paid",
      pg_tid: result.P_TID,
      pay_method: result.P_TYPE ?? null,
      pg_result_msg: result.P_RMESG1 ?? null,
      paid_at: new Date().toISOString(),
    })
    .eq("order_no", oid);

  return finishRedirect(`/order/complete?oid=${encodeURIComponent(oid)}`);
}
