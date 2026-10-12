import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PolicyDoc, { type PolicyBlock } from "@/components/PolicyDoc";
import blocks from "@/content/terms.json";

export const metadata = { title: "이용약관" };

export default function Terms() {
  return (
    <>
      <Header />
      <main className="page" style={{ maxWidth: 860 }}>
        <PolicyDoc title="이용약관" blocks={blocks as PolicyBlock[]} />
      </main>
      <Footer floating={false} />
    </>
  );
}
