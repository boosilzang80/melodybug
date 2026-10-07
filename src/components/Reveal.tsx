"use client";

import { useEffect } from "react";

/**
 * data-reveal 이 붙은 요소가 화면 아래쪽에 들어오면 .in 클래스를 붙여
 * 아래에서 위로 떠오르게 한다. (style="--d: 120ms" 로 순차 지연 가능)
 */
export default function Reveal() {
  useEffect(() => {
    let pending = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    document.documentElement.classList.add("reveal-on");

    const check = () => {
      const line = window.innerHeight * 0.9; // 화면 높이의 90% 지점에 닿으면 등장
      pending = pending.filter((el) => {
        if (el.getBoundingClientRect().top < line) {
          el.classList.add("in");
          return false;
        }
        return true;
      });
      if (pending.length === 0) {
        window.removeEventListener("scroll", check);
        window.removeEventListener("resize", check);
      }
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return null;
}
