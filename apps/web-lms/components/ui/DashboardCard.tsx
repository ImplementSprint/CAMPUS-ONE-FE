import { cn } from "@/lib/utils";

type DashboardCardProps = {
  title: string;
  children: React.ReactNode;
};

export function DashboardCard({ title, children }: DashboardCardProps) {
  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col h-full">
      <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-8 border-b border-gray-200 pb-4">{title}</h2>
      <div className="flex-1">{children}</div>
    </section>
  );
}
