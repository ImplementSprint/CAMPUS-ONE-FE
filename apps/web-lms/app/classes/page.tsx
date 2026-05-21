import { getActiveChild } from "@/components/dashboard/data";
import { ReferenceView } from "@/components/dashboard/ReferenceView";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";

type PageProps = {
  searchParams: Promise<{ tab?: string | string[] }>;
};

export default async function ClassesPage({ searchParams }: PageProps) {
  const { tab } = await searchParams;
  const activeSubtab = getActiveChild("/classes", tab);
  const activeTitle = activeSubtab?.label ?? "All Classes";

  return (
    <AppLayout>
      <div className="space-y-8">
        <SectionHeader
          title={activeSubtab ? `Classes / ${activeTitle}` : "Classes"}
          description=""
        />
        <ReferenceView parent="Classes" activeSubtab={activeTitle} />
      </div>
    </AppLayout>
  );
}
