import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.melodybug.co.kr").replace(/\/$/, "");
const DESCRIPTION =
  "영상 음악, BGM, 게임음악, 애니메이션 음악 작·편곡. 20년 이상 음악경력의 멜로디버그가 영상을 돋보이게 하는 맞춤 음악을 제작합니다. 저작권 양도 포함.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "멜로디버그 | BGM·영상음악·게임음악 제작", template: "%s | 멜로디버그" },
  description: DESCRIPTION,
  keywords: ["bgm", "BGM 제작", "작곡", "게임음악", "영상음악", "배경음악", "애니메이션음악", "쇼츠", "쇼츠음악", "유튜브 BGM", "멜로디버그"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: "멜로디버그",
    title: "멜로디버그 | BGM·영상음악·게임음악 제작",
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: "멜로디버그 | BGM·영상음악·게임음악 제작", description: DESCRIPTION },
  robots: { index: true, follow: true },
  verification: {
    // 구글 서치콘솔 인증 코드가 생기면 GOOGLE_SITE_VERIFICATION 환경변수에 넣으세요
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: { "naver-site-verification": "7d14f1c1917951bf454b204b486264a2281caacf" },
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@500;700;800;900&display=swap" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
