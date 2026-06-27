"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import { ToastProvider } from "./Toast";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <ToastProvider><div className="min-h-screen bg-slate-100">{children}</div></ToastProvider>;
  }

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto bg-slate-50 lg:pl-0">
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}