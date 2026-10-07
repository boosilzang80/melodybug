import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// 카톡·페이스북·구글 등에 링크를 공유할 때 뜨는 미리보기 이미지 (1200x630)
export const alt = "멜로디버그 - Crafting Timeless Music with Exceptional Artistry";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const bg = await readFile(join(process.cwd(), "public/section_1/section1.jpg"));
  const bgSrc = `data:image/jpeg;base64,${bg.toString("base64")}`;
  // 메인 제목과 같은 폰트
  const titleFont = await fetch("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2201-2@1.0/GangwonEduPowerExtraBoldA.woff").then((r) => r.arrayBuffer());

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#111" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={bgSrc} alt="" width={1200} height={630} style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, background: "rgba(0,0,0,0.6)", display: "flex" }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", width: 1200, height: 630, padding: "0 80px", color: "#fff", fontFamily: "Gangwon" }}>
          <div style={{ fontSize: 44, letterSpacing: -1, display: "flex" }}>
            <span style={{ opacity: 0.75 }}>MELODY</span>
            <span>BUG</span>
          </div>
          <div style={{ fontSize: 76, lineHeight: 1.05, letterSpacing: -2, marginTop: 28, display: "flex", flexDirection: "column" }}>
            <span>Crafting Timeless Music</span>
            <span>with Exceptional Artistry</span>
          </div>
          <div style={{ fontSize: 28, marginTop: 36, opacity: 0.85, display: "flex", letterSpacing: 1 }}>BGM · Film Score · Game Music · Animation</div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Gangwon", data: titleFont, style: "normal", weight: 400 }] },
  );
}
