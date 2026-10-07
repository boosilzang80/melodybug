import { inicisConfig } from "@/lib/inicis";

/**
 * 이니시스는 결제창(iframe/팝업) 안에서 returnUrl 로 POST 하므로,
 * 최상위 창을 결과 페이지로 이동시키는 HTML을 돌려준다.
 */
export function finishRedirect(path: string) {
  const url = `${inicisConfig().siteUrl}${path}`;
  const html = `<!doctype html><html><head><meta charset="utf-8"></head><body>
<script>(window.top||window).location.replace(${JSON.stringify(url)});</script>
<noscript><a href="${url}">결과 페이지로 이동</a></noscript></body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
