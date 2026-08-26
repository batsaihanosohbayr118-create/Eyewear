import AdminShell from "@/components/admin/AdminShell";
import SettingsForm from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/db";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="font-display text-3xl">Тохиргоо</h1>
        <p className="text-ink/50 text-sm mt-1">
          Компанийн мэдээлэл, нүүр зураг, холбоо барих, сошиал холбоосуудыг энд шинэчилнэ.
        </p>
      </div>
      <SettingsForm settings={settings} />
    </AdminShell>
  );
}
