import Link from "next/link";
import { BIZ, KAKAO_URL } from "@/lib/content";

export default function Footer({ floating = true }: { floating?: boolean }) {
  return (
    <>
      <footer className="footer">
        <div className="inner footer-in">
          <div className="footer-brand">
            <p className="footer-logo">
              MELODY<b>BUG</b>
            </p>
            <p className="copy">
              Copyright 멜로디버그.
              <br />
              All rights reserved.
            </p>
          </div>
          <div className="footer-info">
            <div className="links">
              <Link href="/privacy">개인정보처리방침</Link>
              <span className="bar" />
              <Link href="/terms">이용약관</Link>
            </div>
            <p className="biz">
              <span>{BIZ.name}</span>
              <span><em>대표</em>{BIZ.ceo}</span>
              <span>{BIZ.address}</span>
            </p>
            <p className="biz">
              <span><em>사업자등록번호</em>{BIZ.bizNo}</span>
              <span><em>TEL</em>{BIZ.tel}</span>
              <span><em>통신판매신고번호</em>: {BIZ.mailOrderNo}</span>
              <a className="biz-check" href={`https://www.ftc.go.kr/bizCommPop.do?wrkr_no=${BIZ.bizNo.replace(/-/g, "")}`} target="_blank" rel="noreferrer">
                사업자정보확인
              </a>
            </p>
          </div>
        </div>
      </footer>
      {floating && (
        <>
          <a className="float-chat" href={KAKAO_URL} target="_blank" rel="noreferrer" aria-label="카카오톡 실시간상담">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/float/chat.png" alt="실시간상담" width={173} height={173} />
          </a>
          <a className="float-top" href="#top" aria-label="상단으로 이동" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            ↑
          </a>
        </>
      )}
    </>
  );
}
