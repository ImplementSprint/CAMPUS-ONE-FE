import React from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
