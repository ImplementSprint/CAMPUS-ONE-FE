import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
};

export function StatCard({ label, value, detail }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#F59E0B] mb-4">{label}</p>
      <p className="text-4xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm font-medium text-gray-600">{detail}</p>
    </div>
  );
}
