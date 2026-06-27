"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteJobButton({
  jobId,
  title,
}: {
  jobId: number;
  title: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to delete");
        return;
      }

      router.refresh();
    } catch {
      alert("Failed to delete job");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleDelete}
      className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition font-medium disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
