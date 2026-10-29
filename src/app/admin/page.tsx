import { redirect } from "next/navigation";
import { getAdminEmail } from "@/lib/supabase-server";
import { supabaseAdmin, type OrderRow } from "@/lib/supabase-admin";
import { won } from "@/lib/plans";
import { logout, markCancelled, restorePaid } from "./actions";
import StatusButton from "./StatusButton";
import "./admin.css";

export const metadata = { title: "결제 내역 - 관리자", robots: { index: false } };

const STATUS: Record<string, string> = { paid: "결제완료", pending: "결제대기", failed: "실패", cancelled: "취소" };

const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("ko-KR", { timeZone: "Asia/Seoul", dateStyle: "short", timeStyle: "short" }) : "-";

const phoneFmt = (p: string) => p.replace(/^(\d{3})(\d{3,4})(\d{4})$/, "$1-$2-$3");

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) redirect("/admin/login");

  const { status = "paid", q = "" } = await searchParams;
  let query = supabaseAdmin().from("orders").select("*").order("created_at", { ascending: false }).limit(300);
  if (status !== "all") query = query.eq("status", status);
  const keyword = q.trim().replace(/[,()%]/g, "");
  if (keyword) query = query.or(`buyer_name.ilike.%${keyword}%,buyer_phone.ilike.%${keyword.replace(/-/g, "")}%,buyer_email.ilike.%${keyword}%,order_no.ilike.%${keyword}%`);
  const { data, error } = await query;
  const orders = (data ?? []) as OrderRow[];
  const paidTotal = orders.filter((o) => o.status === "paid").reduce((s, o) => s + o.amount, 0);

  return (
    <main className="admin">
      <header className="admin-top">
        <h1>결제 내역</h1>
        <form action={logout}>
          <span>{adminEmail.split("@")[0]}</span>
          <button>로그아웃</button>
        </form>
      </header>

      <form className="admin-filter">
        <select name="status" defaultValue={status}>
          <option value="paid">결제완료</option>
          <option value="all">전체</option>
          <option value="pending">결제대기</option>
          <option value="failed">실패</option>
          <option value="cancelled">취소</option>
        </select>
        <input name="q" defaultValue={q} placeholder="이름, 연락처, 이메일, 주문번호" />
        <button>검색</button>
      </form>

      <p className="admin-sum">
        {orders.length}건 · 결제완료 합계 <b>{won(paidTotal)}</b>
      </p>
      {error && <p className="error">불러오기 실패: {error.message}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>결제일시</th>
              <th>상태</th>
              <th>주문자</th>
              <th>연락처</th>
              <th>이메일</th>
              <th>상품</th>
              <th>금액</th>
              <th>결제수단</th>
              <th>요청사항</th>
              <th>주문번호 / TID</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={11} className="empty">내역이 없습니다.</td>
              </tr>
            )}
            {orders.map((o) => (
              <tr key={o.id}>
                <td data-label="결제일시">{fmt(o.paid_at ?? o.created_at)}</td>
                <td data-label="상태"><span className={`badge ${o.status}`}>{STATUS[o.status] ?? o.status}</span></td>
                <td data-label="주문자"><b>{o.buyer_name}</b></td>
                <td data-label="연락처"><a href={`tel:${o.buyer_phone}`}>{phoneFmt(o.buyer_phone)}</a></td>
                <td data-label="이메일"><a href={`mailto:${o.buyer_email}`}>{o.buyer_email}</a></td>
                <td data-label="상품">{o.product_name}</td>
                <td data-label="금액">{won(o.amount)}</td>
                <td data-label="결제수단">{o.pay_method ?? "-"}</td>
                <td data-label="요청사항" className="memo">{o.memo ?? "-"}{o.status === "failed" && o.pg_result_msg ? ` (${o.pg_result_msg})` : ""}</td>
                <td data-label="주문번호" className="mono">{o.order_no}<br />{o.pg_tid ?? ""}</td>
                <td>
                  {o.status === "paid" && (
                    <StatusButton
                      action={markCancelled}
                      orderNo={o.order_no}
                      label="취소 처리"
                      confirmText={`${o.buyer_name}님 주문을 '취소'로 표시할까요?\n\n※ 실제 환불은 되지 않습니다. 이니시스에서 먼저 취소했는지 확인하세요.`}
                    />
                  )}
                  {o.status === "cancelled" && o.paid_at && (
                    <StatusButton
                      action={restorePaid}
                      orderNo={o.order_no}
                      label="취소 되돌리기"
                      confirmText={`${o.buyer_name}님 주문을 다시 '결제완료'로 되돌릴까요?`}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="admin-help">※ 환불은 KG이니시스 가맹점 관리자에서 진행한 뒤 &quot;취소 처리&quot;를 눌러 상태를 맞춰주세요.</p>
    </main>
  );
}
