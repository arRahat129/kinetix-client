import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row">
      {/* Sidebar Component */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 min-w-0">
        {children}
      </main>
    </div>
  );
}
