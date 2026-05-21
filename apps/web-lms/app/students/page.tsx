import { getActiveChild } from "@/components/dashboard/data";
import { ReferenceView } from "@/components/dashboard/ReferenceView";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";

type PageProps = {
  searchParams: Promise<{ tab?: string | string[] }>;
};

export default async function StudentsPage({ searchParams }: PageProps) {
  const { tab } = await searchParams;
  const activeSubtab = getActiveChild("/students", tab);
  const activeTitle = activeSubtab?.label ?? "All Students";

  return (
    <AppLayout>
      <div className="space-y-8">
        <SectionHeader
          title={activeSubtab ? `Students / ${activeTitle}` : "Students"}
          description=""
          action={activeTitle === "Admission Letter" ? undefined : "Import Students"}
        />
        <ReferenceView parent="Students" activeSubtab={activeTitle} />
      </div>
    </AppLayout>
  );
}
