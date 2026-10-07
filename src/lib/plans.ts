// 판매 상품. 결제 금액은 항상 서버에서 이 값으로 검증한다.
export type PlanId = "short" | "medium" | "large" | "test";

export type Plan = {
  id: PlanId;
  name: string;
  price: number;
  days: number;
  summary: string;
  length: string;
};

export const PLANS: Plan[] = [
  { id: "short", name: "SHORT", price: 110000, days: 1, summary: "BGM 및 영상에 맞는 음악 제작", length: "10초 미만 BGM 제작" },
  { id: "medium", name: "MEDIUM", price: 330000, days: 3, summary: "BGM 및 영상에 맞는 음악 제작", length: "1분 내외 BGM 제작" },
  { id: "large", name: "LARGE", price: 660000, days: 6, summary: "BGM 및 영상에 맞는 음악 제작", length: "2분 내외 BGM 제작" },
];

// 결제 테스트용 1,000원 상품 — 메인 화면에는 안 나오고 /order?plan=test 로만 접근.
// 서버 환경변수 ENABLE_TEST_PLAN=true 일 때만 주문 가능 (오픈 시 false 로)
export const TEST_PLAN: Plan = { id: "test", name: "TEST", price: 1000, days: 0, summary: "결제 테스트용 상품", length: "실제 작업 없음 · 결제 후 취소" };

export function isTestPlanEnabled() {
  return process.env.ENABLE_TEST_PLAN === "true";
}

export function getPlan(id: string | undefined | null): Plan | undefined {
  if (id === "test") return isTestPlanEnabled() ? TEST_PLAN : undefined;
  return PLANS.find((p) => p.id === id);
}

export const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;

// 추가 옵션: 작편곡 부분추가 (건당)
export const EXTRA_UNIT_PRICE = 55000;
export const MAX_EXTRA = 10;
export const MAX_QTY = 10;

export function calcTotal(plan: Plan, quantity: number, extra: number) {
  return plan.price * quantity + EXTRA_UNIT_PRICE * extra;
}

export function orderTitle(plan: Plan, quantity: number, extra: number) {
  let t = `멜로디버그 BGM ${plan.name}`;
  if (quantity > 1) t += ` x${quantity}`;
  if (extra > 0) t += ` (+작편곡 부분추가 ${extra}건)`;
  return t;
}
