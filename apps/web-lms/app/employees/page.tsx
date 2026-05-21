import { getActiveChild } from "@/components/dashboard/data";
import { ReferenceView } from "@/components/dashboard/ReferenceView";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";

type PageProps = {
  searchParams: Promise<{ tab?: string | string[] }>;
};

export default async function EmployeesPage({ searchParams }: PageProps) {
  const { tab } = await searchParams;
  const activeSubtab = getActiveChild("/employees", tab);
  const activeTitle = activeSubtab?.label ?? "All Employees";

  return (
    <AppLayout>
      <div className="space-y-8">
        <SectionHeader
          title={activeSubtab ? `Employees / ${activeTitle}` : "Employees"}
          description=""
        />
        <ReferenceView parent="Employees" activeSubtab={activeTitle} />
      </div>
    </AppLayout>
  );
}
