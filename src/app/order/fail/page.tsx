import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { KAKAO_URL } from "@/lib/content";

export const metadata = { title: "결제 실패", robots: { index: false } };

export default function FailPage() {
  return (
    <>
      <Header />
      <main className="page">
        <h1>결제가 완료되지 않았습니다</h1>
        <p style={{ marginBottom: 32 }}>
          결제가 취소되었거나 처리 중 문제가 발생했습니다. 다시 시도하시거나, 문제가 계속되면 카카오톡으로 문의해 주세요.
        </p>
        <div style={{ display: "grid", gap: 8 }}>
          <Link className="btn" href="/order">다시 주문하기</Link>
          <a className="btn line" href={KAKAO_URL} target="_blank" rel="noreferrer">카카오톡 문의</a>
        </div>
      </main>
      <Footer floating={false} />
    </>
  );
}
