import { inicisConfig } from "@/lib/inicis";

// PC 결제창에서 사용자가 닫기(X)를 눌렀을 때 호출되는 페이지
export function GET() {
  const src = inicisConfig().test
    ? "https://stgstdpay.inicis.com/stdjs/INIStdPay_close.js"
    : "https://stdpay.inicis.com/stdjs/INIStdPay_close.js";
  const html = `<!doctype html><html><head><meta charset="utf-8"><script src="${src}"></script></head><body></body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

export const POST = GET;
