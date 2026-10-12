import { brandIcon } from "@/lib/brand-icon";

// 브라우저 탭 아이콘 (MELODY / BUG)
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return brandIcon(512);
}
