// 기존 사이트(melodybug.co.kr/shop_info)에서 옮겨온 약관·방침 문서 렌더러
export type PolicyBlock = { t: "h" | "p"; x: string };

export default function PolicyDoc({ title, blocks }: { title: string; blocks: PolicyBlock[] }) {
  // 첫 블록이 문서 제목과 같으면 중복 표시하지 않음
  const body = blocks[0]?.t === "h" && blocks[0].x === title ? blocks.slice(1) : blocks;
  return (
    <article className="policy">
      <h1>{title}</h1>
      {body.map((b, i) => (b.t === "h" ? <h2 key={i}>{b.x}</h2> : <p key={i}>{b.x}</p>))}
    </article>
  );
}
