"use client";

// 상태 변경 버튼 — 실수로 누르지 않도록 확인 창을 띄운다
export default function StatusButton({
  action,
  orderNo,
  label,
  confirmText,
}: {
  action: (formData: FormData) => Promise<void>;
  orderNo: string;
  label: string;
  confirmText: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      <input type="hidden" name="order_no" value={orderNo} />
      <button className="small">{label}</button>
    </form>
  );
}
