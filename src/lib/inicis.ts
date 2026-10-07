import "server-only";
import { createHash } from "crypto";

// KG이니시스 연동 (PC: 표준결제 INIStdPay / 모바일: 스마트결제)
// 테스트: INICIS_MID=INIpayTest, INICIS_SIGN_KEY=SU5JTElURV9UUklQTEVERVNfS0VZU1RS, INICIS_TEST=true

const sha256 = (s: string) => createHash("sha256").update(s, "utf8").digest("hex");

export const inicisConfig = () => ({
  mid: process.env.INICIS_MID!,
  signKey: process.env.INICIS_SIGN_KEY!,
  test: process.env.INICIS_TEST === "true",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
});

export function stdPayScriptUrl() {
  return inicisConfig().test
    ? "https://stgstdpay.inicis.com/stdjs/INIStdPay.js"
    : "https://stdpay.inicis.com/stdjs/INIStdPay.js";
}

export const MOBILE_PAY_URL = "https://mobile.inicis.com/smart/payment/";

type OrderForPay = { order_no: string; amount: number; product_name: string; buyer_name: string; buyer_phone: string; buyer_email: string };

/** PC 표준결제창에 넘길 form 필드 */
export function buildStdPayFields(o: OrderForPay) {
  const { mid, signKey, siteUrl } = inicisConfig();
  const timestamp = Date.now().toString();
  const price = String(o.amount);
  return {
    version: "1.0",
    gopaymethod: "Card:DirectBank:VBank",
    mid,
    oid: o.order_no,
    price,
    timestamp,
    use_chkfake: "Y",
    signature: sha256(`oid=${o.order_no}&price=${price}&timestamp=${timestamp}`),
    verification: sha256(`oid=${o.order_no}&price=${price}&signKey=${signKey}&timestamp=${timestamp}`),
    mKey: sha256(signKey),
    currency: "WON",
    goodname: o.product_name,
    buyername: o.buyer_name,
    buyertel: o.buyer_phone,
    buyeremail: o.buyer_email,
    returnUrl: `${siteUrl}/api/inicis/return`,
    closeUrl: `${siteUrl}/api/inicis/close`,
    acceptmethod: "HPP(1):below1000:centerCd(Y)",
  };
}

/** 모바일 결제창에 넘길 form 필드 */
export function buildMobilePayFields(o: OrderForPay) {
  const { mid, siteUrl } = inicisConfig();
  return {
    P_INI_PAYMENT: "CARD",
    P_MID: mid,
    P_OID: o.order_no,
    P_AMT: String(o.amount),
    P_GOODS: o.product_name,
    P_UNAME: o.buyer_name,
    P_MOBILE: o.buyer_phone,
    P_EMAIL: o.buyer_email,
    P_NEXT_URL: `${siteUrl}/api/inicis/mobile-return`,
    P_CHARSET: "utf8",
    P_RESERVED: "centerCd=Y",
  };
}

// 이니시스가 돌려준 승인 URL이 진짜 이니시스 도메인인지 확인 (위조 방지)
const IDC_HOSTS: Record<string, string> = {
  fc: "fcstdpay.inicis.com",
  ks: "ksstdpay.inicis.com",
  stg: "stgstdpay.inicis.com",
};

export function isTrustedInicisUrl(url: string, idcName?: string | null) {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return false;
    if (idcName && IDC_HOSTS[idcName]) return u.hostname === IDC_HOSTS[idcName];
    return u.hostname.endsWith(".inicis.com");
  } catch {
    return false;
  }
}

/** PC 결제 인증 후 승인 요청 */
export async function approveStdPay(authUrl: string, authToken: string) {
  const { mid, signKey } = inicisConfig();
  const timestamp = Date.now().toString();
  const body = new URLSearchParams({
    mid,
    authToken,
    timestamp,
    signature: sha256(`authToken=${authToken}&timestamp=${timestamp}`),
    verification: sha256(`authToken=${authToken}&signKey=${signKey}&timestamp=${timestamp}`),
    charset: "UTF-8",
    format: "JSON",
  });
  const res = await fetch(authUrl, { method: "POST", body, cache: "no-store" });
  return (await res.json()) as Record<string, string>;
}

/** 승인 후 우리 쪽 처리 실패 시 결제 망취소 */
export async function netCancelStdPay(netCancelUrl: string, authToken: string) {
  const { mid, signKey } = inicisConfig();
  const timestamp = Date.now().toString();
  const body = new URLSearchParams({
    mid,
    authToken,
    timestamp,
    signature: sha256(`authToken=${authToken}&timestamp=${timestamp}`),
    verification: sha256(`authToken=${authToken}&signKey=${signKey}&timestamp=${timestamp}`),
    charset: "UTF-8",
    format: "JSON",
  });
  await fetch(netCancelUrl, { method: "POST", body, cache: "no-store" }).catch(() => {});
}

/** 모바일 결제 인증 후 승인 요청 (응답은 querystring 형식) */
export async function approveMobilePay(reqUrl: string, tid: string) {
  const { mid } = inicisConfig();
  const res = await fetch(reqUrl, {
    method: "POST",
    body: new URLSearchParams({ P_MID: mid, P_TID: tid }),
    cache: "no-store",
  });
  // 모바일 승인 응답은 EUC-KR일 수 있으므로 바이트로 받아 디코딩
  const buf = await res.arrayBuffer();
  let text = new TextDecoder("utf-8").decode(buf);
  if (text.includes("�")) text = new TextDecoder("euc-kr").decode(buf);
  return Object.fromEntries(new URLSearchParams(text)) as Record<string, string>;
}

export function newOrderNo() {
  const d = new Date(Date.now() + 9 * 3600 * 1000); // KST
  const ymd = d.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `MB${ymd}${rand}`;
}
