"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({
  endpoint,
  label,
  redirectOnDelete,
}: {
  endpoint: string;
  label: string;
  redirectOnDelete?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${label}"? This cannot be undone.`)) return;
    setLoading(true);

    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to delete");
        return;
      }
      if (redirectOnDelete) {
        router.push(redirectOnDelete);
      }
      router.refresh();
    } catch {
      alert("Failed to delete");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleDelete}
      className="flex-1 text-center px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition font-medium disabled:opacity-50"
    >
      {loading ? "..." : "Delete"}
    </button>
  );
}
