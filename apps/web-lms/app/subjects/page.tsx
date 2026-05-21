import { getActiveChild } from "@/components/dashboard/data";
import { ReferenceView } from "@/components/dashboard/ReferenceView";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";

type PageProps = {
  searchParams: Promise<{ tab?: string | string[] }>;
};

export default async function SubjectsPage({ searchParams }: PageProps) {
  const { tab } = await searchParams;
  const activeSubtab = getActiveChild("/subjects", tab);
  const activeTitle = activeSubtab?.label ?? "Classes With Subjects";

  return (
    <AppLayout>
      <div className="space-y-8">
        <SectionHeader
          title={activeSubtab ? `Subjects / ${activeTitle}` : "Subjects"}
          description=""
        />
        <ReferenceView parent="Subjects" activeSubtab={activeTitle} />
      </div>
    </AppLayout>
  );
}
