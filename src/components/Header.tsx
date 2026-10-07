"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/content";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`header${scrolled ? " scrolled" : ""}`}>
      <div className="inner">
        <Link href="/" className="logo" onClick={() => setOpen(false)}>
          MELODY<b>BUG</b>
        </Link>
        <nav className={`gnb${open ? " open" : ""}`}>
          {NAV.map((n) => (
            <a key={n.href} href={`/${n.href}`} onClick={() => setOpen(false)}>
              {n.label}
            </a>
          ))}
        </nav>
        <button className={`menu-btn${open ? " open" : ""}`} aria-label="메뉴" onClick={() => setOpen((v) => !v)}>
          <span />
        </button>
      </div>
    </header>
  );
}
