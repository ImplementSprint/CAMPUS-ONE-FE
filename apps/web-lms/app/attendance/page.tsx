import { getActiveChild } from "@/components/dashboard/data";
import { ReferenceView } from "@/components/dashboard/ReferenceView";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";

type PageProps = {
  searchParams: Promise<{ tab?: string | string[] }>;
};

export default async function AttendancePage({ searchParams }: PageProps) {
  const { tab } = await searchParams;
  const activeSubtab = getActiveChild("/attendance", tab);
  const activeTitle = activeSubtab?.label ?? "Students Attendance";

  return (
    <AppLayout>
      <div className="space-y-8">
        <SectionHeader
          title={activeSubtab ? `Attendance / ${activeTitle}` : "Attendance"}
          description=""
        />
        <ReferenceView parent="Attendance" activeSubtab={activeTitle} />
      </div>
    </AppLayout>
  );
}
