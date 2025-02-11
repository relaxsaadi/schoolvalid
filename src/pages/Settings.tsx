
import { Card } from "@/components/ui/card";
import { UserNav } from "@/components/UserNav";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { useState } from "react";

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 lg:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white">
          <div className="flex flex-1 justify-end px-4">
            <div className="ml-4 flex items-center md:ml-6">
              <UserNav />
            </div>
          </div>
        </div>

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col space-y-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
              <p className="text-sm text-muted-foreground">
                Manage your account settings and preferences.
              </p>
            </div>

            <Card className="p-6">
              <h2 className="text-lg font-medium mb-4">Coming Soon</h2>
              <p className="text-sm text-muted-foreground">
                Account settings and preferences will be available here soon.
              </p>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
