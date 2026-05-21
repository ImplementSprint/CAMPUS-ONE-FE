import { getActiveChild } from "@/components/dashboard/data";
import { ReferenceView } from "@/components/dashboard/ReferenceView";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";

type PageProps = {
  searchParams: Promise<{ tab?: string | string[] }>;
};

export default async function FeesPage({ searchParams }: PageProps) {
  const { tab } = await searchParams;
  const activeSubtab = getActiveChild("/fees", tab);
  const activeTitle = activeSubtab?.label ?? "Generate Fees Invoice";

  return (
    <AppLayout>
      <div className="space-y-8">
        <SectionHeader
          title={activeSubtab ? `Fees / ${activeTitle}` : "Fees"}
          description=""
        />
        <ReferenceView parent="Fees" activeSubtab={activeTitle} />
      </div>
    </AppLayout>
  );
}
