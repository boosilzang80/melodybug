import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NoticeTabs from "@/components/NoticeTabs";
import HeroSlider from "@/components/HeroSlider";
import VideoCard from "@/components/VideoCard";
import Reveal from "@/components/Reveal";
import { PLANS, won } from "@/lib/plans";
import { AWARDS, BIZ, CAREER, GENRES, KAKAO_URL, SERVICES, SFX_NOTE, SOUNDCLOUD_URL, TRACKS, VIDEOS } from "@/lib/content";

// 구글 검색용 사업자·상품 정보 (구조화 데이터)
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.melodybug.co.kr").replace(/\/$/, "");
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: BIZ.name,
  alternateName: "MelodyBug",
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  description: "영상 음악, BGM, 게임음악, 애니메이션 음악 작·편곡 전문",
  telephone: "+82-10-5109-7620",
  founder: BIZ.ceo,
  address: { "@type": "PostalAddress", addressCountry: "KR", addressRegion: "경기도", addressLocality: "고양시 덕양구", streetAddress: "오금2로 26" },
  sameAs: [SOUNDCLOUD_URL, KAKAO_URL],
  makesOffer: PLANS.map((p) => ({
    "@type": "Offer",
    name: `BGM 제작 ${p.name}`,
    description: `${p.summary} - ${p.length}`,
    price: p.price,
    priceCurrency: "KRW",
    url: `${SITE_URL}/order?plan=${p.id}`,
  })),
};

export default function Home() {
  return (
    <>
      {/* 고정된 사이트 정보만 들어가므로 별도 이스케이프 불필요 */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div id="top" />
      <Header />

      <main>
        {/* 메인 비주얼 */}
        <section className="hero">
          <HeroSlider />
          <div className="inner hero-text">
            <h1>
              <span>Crafting Timeless</span> <span>Music with</span> <span>Exceptional</span> <span>Artistry</span>
            </h1>
            <p className="ko">예술적 완성도로, 평생 간직할 음악을 만듭니다.</p>
          </div>
        </section>
        <section className="hero-sub">
          <div className="inner">
            <p className="eyebrow" data-reveal>영상 음악, BGM, 게임음악, 애니메이션 음악 작.편곡</p>
            <h2 data-reveal style={{ "--d": "100ms" } as React.CSSProperties}>20년이상 다양한 음악경력으로 완성된 장인정신</h2>
            <p className="desc" data-reveal style={{ "--d": "200ms" } as React.CSSProperties}>
              멜로디버그가 영상을 돋보일 수 있는 감각적인 음악을 제공 합니다.
              <br />
              (정부지원사업, 공공기관 사업 유경험)
            </p>
          </div>
        </section>

        {/* 소개 */}
        <section id="intro" className="section intro">
          <div className="inner">
            <h2 className="intro-title" data-reveal>멜로디버그 소개</h2>
            <p className="intro-text" data-reveal>
              영상 음악, BGM, 게임음악, 작,편곡자입니다.
              <br />
              유튜버 크리에이터, 애니메이션 음악, 기업 프리젠테이션 음악까지 !
              <br />
              성원에 힘입어, 2026년, 7월 1일 기준, 누적 627건의 작업을
              <br />
              할 수 있었습니다. 감사드립니다.
            </p>
            <p className="intro-promise" data-reveal>앞으로도, 공정한 가격과 정성을 다한 서비스를 약속드립니다.</p>
            <div className="genres">
              {GENRES.map((g, i) => (
                <div key={g} className={`genre g${i + 1}`} data-reveal style={{ "--d": `${i * 120}ms` } as React.CSSProperties}>
                  {g}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 작업 방식 */}
        <section className="way3">
          <div className="inner">
            <ul className="way3-list">
              {["멜로디버그(메인작곡가)를 중심으로,", "파트 전문가와의 협업을 통해,", "완성도 높은 결과물을 추구합니다."].map((t, i) => (
                <li key={t} data-reveal style={{ "--d": `${i * 120}ms` } as React.CSSProperties}>{t}</li>
              ))}
            </ul>
            <p className="way3-note" data-reveal>(협업 전문가와 계약서 작성, 안전성과 공정함 유지.)</p>
            <p className="way3-b2b" data-reveal>B2B (Business to Business) 의뢰를 중심으로 하는 서비스입니다.</p>
            <p className="way3-note" data-reveal>(개인문의 고객의 경우 상담을 통해 합리적인 견적을 드립니다.)</p>
            <p className="way3-noai" data-reveal>- AI 사용 하지 않습니다. -</p>
          </div>
        </section>

        {/* 가격정보 */}
        <section id="price" className="section price-sec">
          <div className="inner">
            <h2 className="intro-title price-title" data-reveal>가격정보</h2>
            <div className="plans">
              {PLANS.map((p, i) => (
                <article key={p.id} className="plan" data-reveal style={{ "--d": `${i * 120}ms` } as React.CSSProperties}>
                  <h3>{p.name}</h3>
                  <p className="price">
                    {won(p.price)} <span>/ 작업일 {p.days}일</span>
                  </p>
                  <p className="desc">
                    {p.summary}
                    <br />
                    {p.length}
                  </p>
                  <p className="warn">
                    * 결제전 상담필요
                    <br />* 주문전 필독 참고
                  </p>
                  <dl className="detail">
                    <dt>상세내용</dt>
                    <dd>저작권 양도 : 포함</dd>
                    <dd>레퍼런스에 따른 견적</dd>
                    <dd>수정 횟수 : 1회</dd>
                    <dd>작업일 : {p.days}일</dd>
                  </dl>
                  <Link className="btn" href={`/order?plan=${p.id}`}>
                    구매
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* MelodyBug_BGM */}
        <section id="bgm" className="section bgm-sec">
          <div className="inner">
            <h2 className="bgm-title" data-reveal>MelodyBug_BGM</h2>
            <h4 data-reveal>- 수상경력 -</h4>
            <ul data-reveal>
              {AWARDS.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
            <ul data-reveal>
              {SERVICES.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <p className="pre" data-reveal>{SFX_NOTE}</p>
            <h4 data-reveal>- 사업경력 -</h4>
            <ul data-reveal>
              {CAREER.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* 주문전 필독 */}
        <section id="notice" className="section notice-sec">
          <div className="inner">
            <h2 className="intro-title price-title" data-reveal>주문전 필독!</h2>
            <p className="notice-lead" data-reveal>
              영상과 콘텐츠에 어울리는 곡을 찾지 못하신 분을 위해 <b>직접 작곡 및 제작</b>을 통해 맞는 곡을 맞춤 제작하여 드립니다.
            </p>
            <div data-reveal>
              <NoticeTabs />
            </div>
          </div>
        </section>

        {/* 포트폴리오 */}
        <section id="portfolio" className="section portfolio-sec">
          <div className="inner">
            <h2 className="intro-title price-title" data-reveal>포트폴리오</h2>
            <div className="portfolio">
              {TRACKS.map((t, i) => (
                <iframe
                  data-reveal
                  style={{ "--d": `${(i % 3) * 120}ms` } as React.CSSProperties}
                  key={t.url}
                  title={`melodybug · ${t.title}`}
                  loading="lazy"
                  allow="autoplay"
                  src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(t.url)}&color=%23111111&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=false`}
                />
              ))}
            </div>
            <div className="videos">
              {VIDEOS.map((id, i) => (
                <div key={id} data-reveal style={{ "--d": `${(i % 3) * 120}ms` } as React.CSSProperties}>
                  <VideoCard id={id} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <Reveal />
    </>
  );
}
