"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardIndexPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      const role = session?.user?.role?.toLowerCase();
      if (role === "admin") {
        router.replace("/dashboard/admin");
      } else if (role === "creator") {
        router.replace("/dashboard/creator");
      } else {
        router.replace("/dashboard/supporter");
      }
    }
  }, [session, isPending, router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Loading dashboard layout for your role...
        </p>
      </div>
    </div>
  );
}
