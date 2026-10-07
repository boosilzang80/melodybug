import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { won } from "@/lib/plans";

export const metadata = { title: "결제 완료", robots: { index: false } };

export default async function CompletePage({ searchParams }: { searchParams: Promise<{ oid?: string }> }) {
  const { oid } = await searchParams;
  const { data: order } = oid
    ? await supabaseAdmin().from("orders").select("order_no, product_name, amount, status, paid_at").eq("order_no", oid).single()
    : { data: null };
  const paid = order?.status === "paid";

  return (
    <>
      <Header />
      <main className="page">
        <h1>{paid ? "결제가 완료되었습니다" : "결제 내역을 확인할 수 없습니다"}</h1>
        {paid && order && (
          <>
            <p>주문해 주셔서 감사합니다. 입력하신 연락처로 곧 연락드리겠습니다.</p>
            <div className="result-box">
              <div className="row"><span>주문번호</span><span>{order.order_no}</span></div>
              <div className="row"><span>상품</span><span>{order.product_name}</span></div>
              <div className="row"><span>결제금액</span><span>{won(order.amount)}</span></div>
            </div>
          </>
        )}
        <Link className="btn" href="/">홈으로</Link>
      </main>
      <Footer floating={false} />
    </>
  );
}
