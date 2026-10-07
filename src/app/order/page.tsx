import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderForm from "./OrderForm";
import { getPlan, PLANS, TEST_PLAN } from "@/lib/plans";

export const metadata = { title: "주문하기", alternates: { canonical: "/order" } };

export default async function OrderPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan } = await searchParams;
  const isTest = plan === "test" && !!getPlan("test");
  const plans = isTest ? [TEST_PLAN] : PLANS;
  const initial = isTest ? TEST_PLAN.id : (getPlan(plan)?.id ?? PLANS[0].id);
  return (
    <>
      <Header />
      <main className="page">
        <h1>주문하기</h1>
        {isTest && <p className="test-banner">⚠️ 결제 테스트용 1,000원 상품입니다. 결제 후 이니시스 관리자에서 취소하세요.</p>}
        <OrderForm initialPlan={initial} plans={plans} />
      </main>
      <Footer floating={false} />
    </>
  );
}
