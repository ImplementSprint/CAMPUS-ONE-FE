import { getActiveChild } from "@/components/dashboard/data";
import { AppLayout } from "@/components/layout/AppLayout";
import { SalaryView } from "@/components/salary/SalaryView";
import { SectionHeader } from "@/components/ui/SectionHeader";

type PageProps = {
  searchParams: Promise<{ tab?: string | string[] }>;
};

export default async function SalaryPage({ searchParams }: PageProps) {
  const { tab } = await searchParams;
  const activeSubtab = getActiveChild("/salary", tab);
  const activeTitle = activeSubtab?.label ?? "Payroll Setup";

  return (
    <AppLayout>
      <div className="space-y-8">
        <SectionHeader
          title={activeSubtab ? `Salary / ${activeTitle}` : "Salary"}
          description=""
        />
        <SalaryView activeSubtab={activeTitle} />
      </div>
    </AppLayout>
  );
}
