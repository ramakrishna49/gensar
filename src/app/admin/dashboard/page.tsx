import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { jobs, submissions, clientLogos, testimonials } from "@/lib/db/schema";
import { redirect } from "next/navigation";
import { eq, count } from "drizzle-orm";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const [activeJobs, allJobs, allSubmissions, unreadSubmissions, activeLogos, activeTestimonials] = await Promise.all([
    db.select({ value: count() }).from(jobs).where(eq(jobs.isActive, true)),
    db.select({ value: count() }).from(jobs),
    db.select({ value: count() }).from(submissions),
    db.select({ value: count() }).from(submissions).where(eq(submissions.read, false)),
    db.select({ value: count() }).from(clientLogos).where(eq(clientLogos.isActive, true)),
    db.select({ value: count() }).from(testimonials).where(eq(testimonials.isActive, true)),
  ]);

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back, {session.user.name || session.user.email}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Job Openings" value={String(activeJobs[0]?.value ?? 0)} description={`${allJobs[0]?.value ?? 0} total · ${activeJobs[0]?.value ?? 0} active`} color="blue" />
        <StatCard title="Submissions" value={String(allSubmissions[0]?.value ?? 0)} description={`${unreadSubmissions[0]?.value ?? 0} unread · ${(allSubmissions[0]?.value ?? 0) - (unreadSubmissions[0]?.value ?? 0)} read`} color="green" />
        <StatCard title="Client Logos" value={String(activeLogos[0]?.value ?? 0)} description="Active logos" color="purple" />
        <StatCard title="Testimonials" value={String(activeTestimonials[0]?.value ?? 0)} description="Published" color="amber" />
      </div>
    </div>
  );
}

function StatCard({ title, value, description, color }: { title: string; value: string; description: string; color: "blue" | "green" | "purple" | "amber" }) {
  const colors = { blue: "bg-blue-50 border-blue-200 text-blue-700", green: "bg-emerald-50 border-emerald-200 text-emerald-700", purple: "bg-purple-50 border-purple-200 text-purple-700", amber: "bg-amber-50 border-amber-200 text-amber-700" };
  return (
    <div className={`rounded-xl border p-6 ${colors[color]}`}>
      <h3 className="text-sm font-medium opacity-80">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className="text-sm mt-1 opacity-70">{description}</p>
    </div>
  );
}
