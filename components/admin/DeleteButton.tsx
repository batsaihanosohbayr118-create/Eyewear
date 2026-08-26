"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="text-[12px] text-ink/50 mr-1">"{name}"-г устгах уу?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-[12px] tracking-[0.06em] bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {deleting ? "Устгаж байна…" : "Тийм"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-[12px] tracking-[0.06em] border border-ink/20 text-ink/60 px-4 py-2 rounded-lg hover:bg-ink/5 transition-colors"
        >
          Үгүй
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-[12px] tracking-[0.06em] border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
    >
      Устгах
    </button>
  );
}
