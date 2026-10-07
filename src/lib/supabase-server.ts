import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// 관리자 로그인 세션(쿠키) 확인용 클라이언트
export async function supabaseSession() {
  const cookieStore = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Component에서 호출되면 쿠키를 쓸 수 없음 — 무시
        }
      },
    },
  });
}

export function isAdminEmail(email: string | undefined | null) {
  const list = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return !!email && list.includes(email.toLowerCase());
}

/** 로그인되어 있고 ADMIN_EMAILS 에 포함된 계정이면 이메일을 반환 */
export async function getAdminEmail(): Promise<string | null> {
  const supabase = await supabaseSession();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email;
  return email && isAdminEmail(email) ? email : null;
}
