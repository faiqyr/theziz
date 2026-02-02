import Sidebar from "@/app/dashboard/sidebar";
import DashboardHeader from "@/app/dashboard/dashboardheader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
})
{
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* 1. Sidebar (Fixed Left) */}
      <Sidebar />

      {/* 2. Main Wrapper */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        
        {/* 3. Header (Sticky Top) */}
        <DashboardHeader/>

        {/* 4. Page Content (Scrollable) */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
        
      </div>
    </div>
  );
}