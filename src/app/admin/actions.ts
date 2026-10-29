"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getAdminEmail, isAdminEmail, supabaseSession } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

/** "@"가 없으면 아이디로 보고 @gmail.com을 붙인다 (예: SIRmelod84 → sirmelod84@gmail.com) */
function toLoginEmail(id: string) {
  const v = id.trim().toLowerCase();
  return v.includes("@") ? v : `${v}@gmail.com`;
}

export async function login(_: string | null, formData: FormData): Promise<string | null> {
  const supabase = await supabaseSession();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: toLoginEmail(String(formData.get("email") ?? "")),
    password: String(formData.get("password") ?? ""),
  });
  if (error) return "아이디 또는 비밀번호가 올바르지 않습니다.";
  if (!isAdminEmail(data.user?.email)) {
    await supabase.auth.signOut();
    return "관리자 권한이 없는 계정입니다.";
  }
  redirect("/admin");
}

export async function logout() {
  const supabase = await supabaseSession();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/** 이니시스에서 환불 처리한 뒤, 관리자 화면 상태만 '취소'로 맞춘다 */
export async function markCancelled(formData: FormData) {
  if (!(await getAdminEmail())) redirect("/admin/login");
  const orderNo = String(formData.get("order_no") ?? "");
  await supabaseAdmin().from("orders").update({ status: "cancelled" }).eq("order_no", orderNo).eq("status", "paid");
  revalidatePath("/admin");
}

/** 실수로 '취소 처리'한 주문을 다시 '결제완료'로 되돌린다 (결제 기록이 있는 주문만) */
export async function restorePaid(formData: FormData) {
  if (!(await getAdminEmail())) redirect("/admin/login");
  const orderNo = String(formData.get("order_no") ?? "");
  await supabaseAdmin()
    .from("orders")
    .update({ status: "paid" })
    .eq("order_no", orderNo)
    .eq("status", "cancelled")
    .not("paid_at", "is", null);
  revalidatePath("/admin");
}
