"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function AdminLogin() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <main className="page" style={{ maxWidth: 400 }}>
      <h1>관리자 로그인</h1>
      <form action={action}>
        <div className="field">
          <label htmlFor="email">아이디</label>
          <input id="email" name="email" type="text" required autoComplete="username" autoCapitalize="none" />
        </div>
        <div className="field">
          <label htmlFor="password">비밀번호</label>
          <input id="password" name="password" type="password" required autoComplete="current-password" />
        </div>
        {error && <p className="error">{error}</p>}
        <button className="btn" disabled={pending}>
          {pending ? "로그인 중…" : "로그인"}
        </button>
      </form>
    </main>
  );
}
