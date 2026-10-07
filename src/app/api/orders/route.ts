import { NextResponse } from "next/server";
import { calcTotal, getPlan, MAX_EXTRA, MAX_QTY, orderTitle } from "@/lib/plans";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { buildMobilePayFields, buildStdPayFields, MOBILE_PAY_URL, newOrderNo, stdPayScriptUrl } from "@/lib/inicis";

// 주문 생성 → 'pending' 으로 저장 → 결제창에 넘길 값을 돌려준다
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const plan = getPlan(body?.planId);
  const name = String(body?.name ?? "").trim();
  const phone = String(body?.phone ?? "").replace(/[^0-9]/g, "");
  const email = String(body?.email ?? "").trim();
  const memo = String(body?.memo ?? "").trim().slice(0, 2000);
  const mobile = Boolean(body?.mobile);
  const isTest = body?.planId === "test";
  const quantity = isTest ? 1 : Number(body?.quantity ?? 1); // 테스트 상품은 옵션 없이 1,000원 고정
  const extra = isTest ? 0 : Number(body?.extra ?? 0);

  if (!plan) return NextResponse.json({ error: "상품을 선택해 주세요." }, { status: 400 });
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QTY) return NextResponse.json({ error: "수량을 확인해 주세요." }, { status: 400 });
  if (!Number.isInteger(extra) || extra < 0 || extra > MAX_EXTRA) return NextResponse.json({ error: "추가 옵션을 확인해 주세요." }, { status: 400 });
  if (!name || name.length > 30) return NextResponse.json({ error: "이름을 확인해 주세요." }, { status: 400 });
  if (!/^01[0-9]{8,9}$/.test(phone)) return NextResponse.json({ error: "휴대폰 번호를 확인해 주세요." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "이메일을 확인해 주세요." }, { status: 400 });
  if (!body?.agree) return NextResponse.json({ error: "약관에 동의해 주세요." }, { status: 400 });

  const order = {
    order_no: newOrderNo(),
    plan_id: plan.id,
    product_name: orderTitle(plan, quantity, extra),
    quantity,
    extra_count: extra,
    amount: calcTotal(plan, quantity, extra), // 금액은 반드시 서버에서 계산
    buyer_name: name,
    buyer_phone: phone,
    buyer_email: email,
    memo: memo || null,
    status: "pending" as const,
  };

  let error: unknown = null;
  try {
    ({ error } = await supabaseAdmin().from("orders").insert(order));
  } catch (e) {
    error = e; // Supabase 환경변수 누락 등
  }
  if (error) {
    console.error("order insert failed", error);
    return NextResponse.json({ error: "주문 저장에 실패했습니다. 잠시 후 다시 시도해 주세요." }, { status: 500 });
  }

  return mobile
    ? NextResponse.json({ type: "mobile", action: MOBILE_PAY_URL, fields: buildMobilePayFields(order) })
    : NextResponse.json({ type: "pc", script: stdPayScriptUrl(), fields: buildStdPayFields(order) });
}
