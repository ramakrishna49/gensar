import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { submissions } from "@/lib/db/schema";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import Link from "next/link";

const formTypeLabels: Record<string, string> = { contact: "Contact Form", careers: "Job Application", consultation: "Internship Registration", requirement: "Share Your Requirement", home_consultation: "Home Consultation", newsletter: "Newsletter Subscription" };

export default async function SubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id } = await params;
  const [submission] = await db.select().from(submissions).where(eq(submissions.id, Number(id))).limit(1);
  if (!submission) redirect("/admin/submissions");

  const data = submission.formData as Record<string, unknown>;
  const excludeFields = ["agreeCheck", "contactAgreeCheck", "homeAgreeCheck", "careersAgreeCheck"];

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <Link href="/admin/submissions" className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-block">&larr; Back to Submissions</Link>
        <h1 className="text-2xl font-bold text-slate-900">{formTypeLabels[submission.formType] || submission.formType}</h1>
        <p className="text-slate-500 mt-1">Submitted on {new Date(submission.createdAt).toLocaleString()}{submission.read ? " · Read" : " · Unread"}</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <tbody className="divide-y divide-slate-100">
            {Object.entries(data).map(([key, value]) => {
              if (excludeFields.includes(key)) return null;
              const displayValue = String(value ?? "");
              return (
                <tr key={key} className="hover:bg-slate-50">
                  <td className="px-6 py-3 text-sm font-medium text-slate-500 w-1/3 capitalize">{key.replace(/([A-Z])/g, " $1").replace(/^(.)/, (c) => c.toUpperCase())}</td>
                  <td className="px-6 py-3 text-sm text-slate-900">{displayValue || <span className="text-slate-300 italic">Not provided</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {submission.resumeUrl && (
        <div className="mt-6">
          <a href={submission.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium text-sm">Download Resume</a>
        </div>
      )}
    </div>
  );
}
