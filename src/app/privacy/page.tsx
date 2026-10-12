import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PolicyDoc, { type PolicyBlock } from "@/components/PolicyDoc";
import blocks from "@/content/privacy.json";

export const metadata = { title: "개인정보처리방침" };

export default function Privacy() {
  return (
    <>
      <Header />
      <main className="page" style={{ maxWidth: 860 }}>
        <PolicyDoc title="개인정보 보호정책" blocks={blocks as PolicyBlock[]} />
      </main>
      <Footer floating={false} />
    </>
  );
}
