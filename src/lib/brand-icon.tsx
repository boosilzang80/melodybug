import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// 기존 로고(public/brand/logo.png, 350x98)에서 글자 영역 좌표
const LOGO = { w: 350, h: 98, top: 29, textH: 42 };
const MELODY = { x: 26, w: 195 };
const BUG = { x: 222, w: 101 };

/** 로고 이미지에서 한 부분(x ~ x+w)만 잘라 width 크기로 보여준다 */
function Crop({ src, part, width }: { src: string; part: { x: number; w: number }; width: number }) {
  const s = width / part.w;
  return (
    <div style={{ display: "flex", position: "relative", overflow: "hidden", width, height: LOGO.textH * s }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        width={LOGO.w * s}
        height={LOGO.h * s}
        style={{ position: "absolute", left: -part.x * s, top: -LOGO.top * s }}
      />
    </div>
  );
}

/** MELODY / BUG 두 줄 아이콘 (흰 바탕 + 기존 로고 글자) */
export async function brandIcon(size: number) {
  const logo = await readFile(join(process.cwd(), "public/brand/logo.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;
  const inner = size * 0.84;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: size * 0.05,
          background: "#fff",
          borderRadius: size * 0.18,
        }}
      >
        <Crop src={src} part={MELODY} width={inner} />
        <Crop src={src} part={BUG} width={inner} />
      </div>
    ),
    { width: size, height: size },
  );
}
