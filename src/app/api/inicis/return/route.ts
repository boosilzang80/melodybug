import { approveStdPay, isTrustedInicisUrl, netCancelStdPay } from "@/lib/inicis";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { finishRedirect } from "../shared";

// PC 표준결제: 인증 완료 후 이니시스가 이 URL로 POST 한다
export async function POST(req: Request) {
  const form = await req.formData();
  const get = (k: string) => (form.get(k) as string | null) ?? "";

  const oid = get("orderNumber") || get("oid");
  if (get("resultCode") !== "0000") {
    await markFailed(oid, get("resultMsg") || "인증 실패/취소");
    return finishRedirect(`/order/fail?oid=${encodeURIComponent(oid)}`);
  }

  const authUrl = get("authUrl");
  const netCancelUrl = get("netCancelUrl");
  const authToken = get("authToken");
  const idc = get("idc_name");
  if (!isTrustedInicisUrl(authUrl, idc)) return finishRedirect(`/order/fail?oid=${encodeURIComponent(oid)}`);

  const db = supabaseAdmin();
  const { data: order } = await db.from("orders").select("*").eq("order_no", oid).single();
  if (!order) return finishRedirect(`/order/fail`);
  if (order.status === "paid") return finishRedirect(`/order/complete?oid=${encodeURIComponent(oid)}`);

  let result: Record<string, string>;
  try {
    result = await approveStdPay(authUrl, authToken);
  } catch (e) {
    console.error("inicis approve error", e);
    await markFailed(oid, "승인 요청 오류");
    return finishRedirect(`/order/fail?oid=${encodeURIComponent(oid)}`);
  }

  if (result.resultCode !== "0000") {
    await markFailed(oid, result.resultMsg ?? "승인 실패");
    return finishRedirect(`/order/fail?oid=${encodeURIComponent(oid)}`);
  }

  // 금액 위변조 검증
  if (Number(result.TotPrice) !== order.amount || (result.MOID && result.MOID !== oid)) {
    if (isTrustedInicisUrl(netCancelUrl, idc)) await netCancelStdPay(netCancelUrl, authToken);
    await markFailed(oid, `금액 불일치(${result.TotPrice}) - 망취소`);
    return finishRedirect(`/order/fail?oid=${encodeURIComponent(oid)}`);
  }

  const { error } = await db
    .from("orders")
    .update({
      status: "paid",
      pg_tid: result.tid,
      pay_method: result.payMethod ?? null,
      pg_result_msg: result.resultMsg ?? null,
      paid_at: new Date().toISOString(),
    })
    .eq("order_no", oid);

  if (error) {
    console.error("order update failed", error);
    if (isTrustedInicisUrl(netCancelUrl, idc)) await netCancelStdPay(netCancelUrl, authToken);
    return finishRedirect(`/order/fail?oid=${encodeURIComponent(oid)}`);
  }

  return finishRedirect(`/order/complete?oid=${encodeURIComponent(oid)}`);
}

async function markFailed(oid: string, msg: string) {
  if (!oid) return;
  await supabaseAdmin().from("orders").update({ status: "failed", pg_result_msg: msg }).eq("order_no", oid).eq("status", "pending");
}
