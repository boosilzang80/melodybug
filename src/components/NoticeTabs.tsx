"use client";

import { useState } from "react";
import { NOTICE_TABS } from "@/lib/content";

export default function NoticeTabs() {
  const [active, setActive] = useState(0);
  const tab = NOTICE_TABS[active];
  return (
    <div>
      <div className="tabs" role="tablist">
        {NOTICE_TABS.map((t, i) => (
          <button key={t.title} role="tab" aria-selected={i === active} className={i === active ? "on" : ""} onClick={() => setActive(i)}>
            {t.title}
          </button>
        ))}
      </div>
      <div className="tab-body" role="tabpanel">
        <h4>{tab.title}</h4>
        {tab.body}
      </div>
    </div>
  );
}
