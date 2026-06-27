"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Submission {
  id: number;
  formType: string;
  formData: Record<string, unknown>;
  resumeUrl: string | null;
  read: boolean;
  createdAt: string;
}

const formTypeLabels: Record<string, string> = {
  contact: "Contact",
  careers: "Job Application",
  consultation: "Internship Registration",
  requirement: "Share Requirement",
  home_consultation: "Consultation",
  newsletter: "Newsletter",
};

export default function SubmissionsPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterRead, setFilterRead] = useState("");

  useEffect(() => {
    fetchSubmissions();
  }, [filterType, filterRead]);

  async function fetchSubmissions() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterType) params.set("form_type", filterType);
    if (filterRead) params.set("read", filterRead);

    try {
      const res = await fetch(`/api/admin/submissions?${params}`);
      if (res.ok) {
        setSubmissions(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }

  async function toggleRead(id: number) {
    setTogglingId(id);
    setActionError("");
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, { method: "PUT" });
      if (!res.ok) throw new Error("Failed to toggle read status");
      fetchSubmissions();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setTogglingId(null);
    }
  }

  async function deleteSubmission(id: number, name: string) {
    if (!confirm(`Delete submission #${id} from "${name}"?`)) return;
    setDeletingId(id);
    setActionError("");
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete submission");
      fetchSubmissions();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setDeletingId(null);
    }
  }

  const unreadCount = submissions.filter((s) => !s.read).length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Submissions</h1>
          <p className="text-slate-500 mt-1">
            {submissions.length} total
            {unreadCount > 0 && ` · ${unreadCount} unread`}
          </p>
        </div>
        <a
          href="/api/admin/submissions/export"
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition text-sm"
        >
          Export CSV
        </a>
      </div>

      {actionError && (
        <div className="mb-4 px-4 py-3 bg-red-50 text-red-600 rounded-lg text-sm">{actionError}</div>
      )}

      <div className="flex gap-3 mb-6">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          {Object.entries(formTypeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={filterRead}
          onChange={(e) => setFilterRead(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="false">Unread</option>
          <option value="true">Read</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading...</div>
      ) : submissions.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-400 text-lg">No submissions found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.map((s) => {
                const data = s.formData as Record<string, unknown>;
                const name = String(
                  data.contactName || data.careersName || data.fullName || data.reqName || data.homeName || ""
                );
                const email = String(
                  data.contactEmail || data.careersEmail || data.emailAddr || data.reqEmail || data.homeEmail || ""
                );

                return (
                  <tr
                    key={s.id}
                    className={`hover:bg-slate-50 transition ${!s.read ? "bg-blue-50/50" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {formTypeLabels[s.formType] || s.formType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/submissions/${s.id}`}
                        className="font-medium text-slate-900 hover:text-blue-600 transition"
                      >
                        {name || `#${s.id}`}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{email || "--"}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleRead(s.id)}
                        disabled={togglingId === s.id}
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium transition cursor-pointer disabled:opacity-50 ${
                          s.read
                            ? "bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                            : "bg-blue-100 text-blue-700 hover:bg-slate-100 hover:text-slate-500"
                        }`}
                      >
                        {s.read ? "Read" : "Unread"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/submissions/${s.id}`}
                          className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => deleteSubmission(s.id, name)}
                          disabled={deletingId === s.id}
                          className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition font-medium disabled:opacity-50"
                        >
                          {deletingId === s.id ? "..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
