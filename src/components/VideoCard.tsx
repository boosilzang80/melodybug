"use client";

import { useState } from "react";

// 썸네일 + 흰색 원형 재생 버튼 → 클릭하면 그 자리에서 유튜브 재생
export default function VideoCard({ id }: { id: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="video">
        <iframe
          title="멜로디버그 포트폴리오 영상"
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button className="video" onClick={() => setPlaying(true)} aria-label="멜로디버그 포트폴리오 영상 재생">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="멜로디버그 포트폴리오 영상 썸네일" loading="lazy" />
      <svg className="play" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="29" fill="none" stroke="#fff" strokeWidth="4" />
        <path d="M26 20 L46 32 L26 44 Z" fill="#fff" />
      </svg>
    </button>
  );
}
