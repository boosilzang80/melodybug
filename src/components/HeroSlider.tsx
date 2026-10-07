"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDES = ["/section_1/section1.jpg", "/section_1/section2.jpg", "/section_1/section3.jpg"];
const INTERVAL = 5000; // 한 장이 머무는 시간(ms)

// 메인 비주얼 배경 — 페이드 인/아웃으로 자동 전환
export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hero-bg" aria-hidden="true">
      {SLIDES.map((src, i) => (
        <Image key={src} src={src} alt="" fill priority={i === 0} sizes="100vw" className={i === index ? "on" : ""} />
      ))}
    </div>
  );
}
