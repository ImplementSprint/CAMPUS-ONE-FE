"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { BackendRecord } from "@/lib/backend/types";
import type { ResourceConfig } from "@/components/dashboard/resourceConfig";
import { cn } from "@/lib/utils";

type ResourceManagerProps = {
  config: ResourceConfig;
  activeSubtab: string;
};

function emptyRecord(config: ResourceConfig) {
  return Object.fromEntries(config.fields.map((field) => [field.key, ""])) as BackendRecord;
}

function statusClass(status?: string) {
  const value = status?.toLowerCase() ?? "";

  if (value.includes("ready") || value.includes("active") || value.includes("enrolled")) {
    return "bg-green-50 text-green-700 border border-green-200";
  }

  if (value.includes("review") || value.includes("pending") || value.includes("invited")) {
    return "bg-amber-50 text-amber-700 border border-amber-200";
  }

  return "bg-gray-50 text-gray-600 border border-gray-200";
}

export function ResourceManager({ config, activeSubtab }: ResourceManagerProps) {
  const [rows, setRows] = useState<BackendRecord[]>([]);
  const [form, setForm] = useState<BackendRecord>(() => emptyRecord(config));
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("Loading records...");

  const readyCount = useMemo(
    () =>
      rows.filter((row) => {
        const status = row.status?.toLowerCase() ?? "";
        return status.includes("ready") || status.includes("active") || status.includes("enrolled");
      }).length,
    [rows],
  );

  async function loadRows(query = search) {
    const params = query ? `?search=${encodeURIComponent(query)}` : "";
    const response = await fetch(`/api/${config.resource}${params}`);
    const data = (await response.json()) as BackendRecord[];
    setRows(data);
    setMessage(`${data.length} ${config.statusLabel.toLowerCase()} loaded`);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadRows("");
    }, 0);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.resource]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const isEditing = Boolean(editingId);
    const endpoint = isEditing ? `/api/${config.resource}/${editingId}` : `/api/${config.resource}`;
    const response = await fetch(endpoint, {
      method: isEditing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      setMessage("Unable to save record");
      return;
    }

    setForm(emptyRecord(config));
    setEditingId(null);
    setMessage(isEditing ? "Record updated" : "Record added");
    await loadRows();
  }

  async function deleteRow(id: string) {
    const response = await fetch(`/api/${config.resource}/${id}`, { method: "DELETE" });

    if (!response.ok) {
      setMessage("Unable to delete record");
      return;
    }

    setMessage("Record deleted");
    await loadRows();
  }

  function editRow(row: BackendRecord) {
    setEditingId(row.id);
    setForm({ ...emptyRecord(config), ...row });
    setMessage(`Editing ${row.name ?? row.subject ?? row.user ?? row.id}`);
  }

  return (
    <section className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Subtab", value: activeSubtab },
          { label: "Records", value: rows.length },
          { label: "Ready / Active", value: readyCount },
        ].map((stat, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-black text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.4fr] gap-8">
        <form className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm h-fit sticky top-32" onSubmit={handleSubmit}>
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              {editingId ? "Edit Record" : `Add ${config.title}`}
            </h2>
            <p className="mt-1 text-sm text-gray-500 font-medium">{config.description}</p>
          </div>

          <div className="mt-6 space-y-5">
            {config.fields.map((field) => (
              <label key={field.key} className="block">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-1">{field.label}</span>
                <input
                  className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-gray-500/30"
                  onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
                  placeholder={field.placeholder}
                  type="text"
                  value={form[field.key] ?? ""}
                />
              </label>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/10"
              type="submit"
            >
              {editingId ? "Update Record" : "Add Record"}
            </button>
            {editingId && (
              <button
                className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-bold text-gray-900 transition hover:bg-gray-100"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyRecord(config));
                }}
                type="button"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 border-b border-gray-200 bg-gray-50">
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">{config.statusLabel}</h2>
              <p className="mt-0.5 text-xs font-medium text-gray-500">{message}</p>
            </div>
            <form
              className="flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                void loadRows(search);
              }}
            >
              <input
                className="h-11 w-full md:w-64 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-primary placeholder:text-gray-500/30"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search records..."
                type="search"
                value={search}
              />
              <button className="rounded-xl bg-gray-100 border border-gray-200 px-4 text-xs font-bold text-gray-900 hover:bg-gray-200 transition-colors" type="submit">
                Search
              </button>
            </form>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-primary text-white text-[10px] font-black uppercase tracking-widest">
                <tr>
                  {config.columns.map((column) => (
                    <th key={column} className="px-6 py-4">
                      {column}
                    </th>
                  ))}
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    {config.columns.map((column) => (
                      <td key={column} className="px-6 py-4">
                        {column === "status" || column === "rate" ? (
                          <span className={cn("px-3 py-1 rounded-full text-[11px] font-bold", statusClass(row[column]))}>
                            {row[column]}
                          </span>
                        ) : (
                          <span className="text-gray-900 font-medium">{row[column]}</span>
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-4">
                      <div className="flex gap-4">
                        <button className="text-[12px] font-bold text-primary hover:underline" onClick={() => editRow(row)} type="button">
                          Edit
                        </button>
                        <button className="text-[12px] font-bold text-red-400 hover:underline" onClick={() => deleteRow(row.id)} type="button">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
