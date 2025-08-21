import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="border-b">
        <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <div className="text-lg font-medium">Admin Dashboard</div>
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}


