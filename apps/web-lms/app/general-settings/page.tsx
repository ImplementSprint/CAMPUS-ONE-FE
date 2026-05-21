import { AppLayout } from "@/components/layout/AppLayout";
import { getActiveChild } from "@/components/dashboard/data";
import { RegistrationWorkspace } from "@/components/dashboard/RegistrationWorkspace";
import { SectionHeader } from "@/components/ui/SectionHeader";

type PageProps = {
  searchParams: Promise<{ tab?: string | string[] }>;
};

export default async function GeneralSettingsPage({ searchParams }: PageProps) {
  const { tab } = await searchParams;
  const activeSubtab = getActiveChild("/general-settings", tab);
  const activeTitle = activeSubtab?.label ?? "School Profile";

  return (
    <AppLayout>
      <div className="space-y-8">
        <SectionHeader
          title={activeSubtab ? `General Settings / ${activeTitle}` : "General Settings"}
          description=""
        />
        <RegistrationWorkspace />
      </div>
    </AppLayout>
  );
}
