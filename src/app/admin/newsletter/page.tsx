import { createClient } from "@/lib/supabase/server";
import { Mail, Download } from "lucide-react";

export const revalidate = 0;

export default async function AdminNewsletterPage() {
  const supabase = await createClient();
  const { data: rawEmails } = await supabase
    .from("newsletter")
    .select("id, email, created_at")
    .order("created_at", { ascending: false });
  const emails = rawEmails as Array<{ id: string; email: string; created_at: string }> | null;

  const csvData = `email,data\n${emails?.map((e) => `${e.email},${new Date(e.created_at).toLocaleDateString("pt-BR")}`).join("\n") ?? ""}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--color-dark)]">Newsletter</h1>
          <p className="text-gray-500 mt-1">{emails?.length ?? 0} inscritos</p>
        </div>
        <a
          href={`data:text/csv;charset=utf-8,${encodeURIComponent(csvData)}`}
          download="newsletter-giselle.csv"
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold transition-colors"
        >
          <Download className="w-4 h-4" /> Exportar CSV
        </a>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">E-mail</th>
              <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {emails?.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-[var(--color-dark)]">{e.email}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {new Date(e.created_at).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!emails || emails.length === 0) && (
          <div className="text-center py-16 text-gray-400">
            <Mail className="w-12 h-12 mx-auto mb-3 text-gray-200" />
            <p>Nenhum inscrito ainda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
