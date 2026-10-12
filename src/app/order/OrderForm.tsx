"use client";

import Link from "next/link";
import { useState } from "react";
import { calcTotal, EXTRA_UNIT_PRICE, MAX_EXTRA, MAX_QTY, won, type Plan, type PlanId } from "@/lib/plans";

declare global {
  interface Window {
    INIStdPay?: { pay: (formId: string) => void };
  }
}

type PayResponse =
  | { type: "pc"; script: string; fields: Record<string, string> }
  | { type: "mobile"; action: string; fields: Record<string, string> }
  | { error: string };

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.charset = "UTF-8";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("결제 모듈을 불러오지 못했습니다."));
    document.body.appendChild(s);
  });
}

/** 결제용 hidden form 을 만들어 body 에 붙인다 */
function buildForm(id: string, fields: Record<string, string>, action?: string) {
  document.getElementById(id)?.remove();
  const form = document.createElement("form");
  form.id = id;
  form.method = "POST";
  // 이니시스 모바일 결제창은 요청을 EUC-KR 로 읽는다 (결과는 P_CHARSET=utf8 로 받음)
  form.acceptCharset = action ? "EUC-KR" : "UTF-8";
  if (action) form.action = action;
  form.style.display = "none";
  for (const [k, v] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = k;
    input.value = v;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  return form;
}

const isMobile = () => /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

export default function OrderForm({ initialPlan, plans }: { initialPlan: PlanId; plans: Plan[] }) {
  const [planId, setPlanId] = useState<PlanId>(initialPlan);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [extra, setExtra] = useState(0);
  const [copied, setCopied] = useState(false);
  // 1단계: 상품·옵션 선택 → 2단계: 카드 접고 주문자 정보 입력
  const [step, setStep] = useState<"select" | "info">("select");
  const folded = step === "info";

  function goInfo() {
    setStep("info");
    setTimeout(() => document.getElementById("name")?.focus(), 350);
  }
  const plan = plans.find((p) => p.id === planId)!;
  const isTest = plan.id === "test";
  const total = calcTotal(plan, quantity, extra);

  async function share() {
    const url = `${location.origin}/order?plan=${planId}`;
    try {
      if (navigator.share) await navigator.share({ title: `멜로디버그 BGM ${plan.name}`, url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // 공유 취소 — 무시
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          quantity,
          extra,
          name: fd.get("name"),
          phone: fd.get("phone"),
          email: fd.get("email"),
          memo: fd.get("memo"),
          agree: fd.get("agree") === "on",
          mobile: isMobile(),
        }),
      });
      const data = (await res.json().catch(() => ({ error: "주문 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." }))) as PayResponse;
      if ("error" in data) throw new Error(data.error);

      if (data.type === "mobile") {
        buildForm("inicis-mobile", data.fields, data.action).submit();
        return; // 페이지 이동
      }
      await loadScript(data.script);
      buildForm("inicis-pc", data.fields);
      window.INIStdPay?.pay("inicis-pc");
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      {!folded && plans.length > 1 && (
      <div className="plan-pick">
        {plans.map((p) => (
          <div key={p.id}>
            <input type="radio" id={`plan-${p.id}`} name="plan" checked={p.id === planId} onChange={() => setPlanId(p.id)} />
            <label htmlFor={`plan-${p.id}`}>
              <b>{p.name}</b>
              {won(p.price)}
            </label>
          </div>
        ))}
      </div>
      )}

      <div className={`summary${folded ? " folded" : ""}`}>
        <div className="summary-head">
          <div>
            <h2>{plan.name}</h2>
            <p className="summary-price">{won(plan.price)}</p>
          </div>
          {folded && (
            <button type="button" className="change-btn" onClick={() => setStep("select")}>
              변경
            </button>
          )}
          <button type="button" className="share-btn" onClick={share} aria-label="공유하기">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <circle cx="18" cy="5" r="2.5" />
              <circle cx="6" cy="12" r="2.5" />
              <circle cx="18" cy="19" r="2.5" />
              <path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4" />
            </svg>
            {copied && <span className="share-tip">링크 복사됨</span>}
          </button>
        </div>
        <div className="summary-body">
        <div>
        <p className="summary-desc">
          {plan.summary} · {plan.length}
          <br />
          <em>* 결제전 상담필요 · 주문전 필독 참고</em>
        </p>
        <dl className="summary-detail">
          <dt>상세내용</dt>
          <dd>저작권 양도 : 포함 / 레퍼런스에 따른 견적 / 수정 횟수 : 1회 / 작업일 : {plan.days}일</dd>
        </dl>

        {!isTest && (
          <>
        <div className="opt-row">
          <span className="opt-label">수량</span>
          <div className="qty">
            <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="수량 줄이기">−</button>
            <span>{quantity}</span>
            <button type="button" onClick={() => setQuantity((q) => Math.min(MAX_QTY, q + 1))} aria-label="수량 늘리기">+</button>
          </div>
        </div>
        <div className="opt-row">
          <label className="opt-label" htmlFor="extra">추가 옵션</label>
          <select id="extra" value={extra} onChange={(e) => setExtra(Number(e.target.value))}>
            <option value={0}>추가금 선택 안 함</option>
            {Array.from({ length: MAX_EXTRA }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                추가금 (작편곡 부분추가 {n}건) : {won(EXTRA_UNIT_PRICE * n)}
              </option>
            ))}
          </select>
        </div>
          </>
        )}

        </div>
        </div>

        <div className="row">
          <span>{plan.name} × {quantity}</span>
          <span>{won(plan.price * quantity)}</span>
        </div>
        {extra > 0 && (
          <div className="row">
            <span>작편곡 부분추가 {extra}건</span>
            <span>{won(EXTRA_UNIT_PRICE * extra)}</span>
          </div>
        )}
        <div className="row total">
          <span>결제금액</span>
          <span>{won(total)}</span>
        </div>
      </div>

      {!folded ? (
        <button className="btn" type="button" onClick={goInfo}>
          {won(total)} 결제하기
        </button>
      ) : (
        <div className="info-step">
          <div className="field">
            <label htmlFor="name">이름 *</label>
            <input id="name" name="name" required maxLength={30} autoComplete="name" />
          </div>
          <div className="field">
            <label htmlFor="phone">휴대폰 번호 *</label>
            <input id="phone" name="phone" required inputMode="tel" placeholder="010-0000-0000" autoComplete="tel" />
          </div>
          <div className="field">
            <label htmlFor="email">이메일 *</label>
            <input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="memo">요청사항</label>
            <textarea id="memo" name="memo" maxLength={2000} />
          </div>

          <label className="agree">
            <input type="checkbox" name="agree" required />
            <span>
              <Link href="/terms" target="_blank">이용약관</Link>, <Link href="/privacy" target="_blank">개인정보처리방침</Link> 및{" "}
              <Link href="/#notice" target="_blank">주문전 필독(환불 규정)</Link> 내용을 확인했으며 동의합니다.
            </span>
          </label>

          {error && <p className="error">{error}</p>}
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "결제창 여는 중…" : `${won(total)} 결제하기`}
          </button>
        </div>
      )}
    </form>
  );
}
