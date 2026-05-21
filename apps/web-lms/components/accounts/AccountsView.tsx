"use client";

import { useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronDown, RotateCcw, Save, Search, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type AccountHead = { id: string; name: string; type: string };
type StatementRow = { id: string; date: string; description: string; debit: number; credit: number };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function todayIso() {
  return new Date().toISOString().split("T")[0];
}

function firstOfMonthIso() {
  const d = new Date();
  d.setDate(1);
  return d.toISOString().split("T")[0];
}

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function money(value: number) {
  return `₱${Math.abs(value).toLocaleString("en-PH", { minimumFractionDigits: 0 })}`;
}

// ─── Shared field primitive ───────────────────────────────────────────────────

const inputCls =
  "w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-all focus:border-primary";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="ml-1 text-[11px] font-bold uppercase tracking-widest text-gray-500">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      {children}
    </div>
  );
}

// ─── Chart Of Account ─────────────────────────────────────────────────────────

const HEAD_TYPES = ["Income", "Expense"];

function ChartOfAccountTab() {
  const [heads, setHeads] = useState<AccountHead[]>([]);
  const [headName, setHeadName] = useState("");
  const [headType, setHeadType] = useState("");
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(10);
  const [page, setPage] = useState(0);

  const filtered = useMemo(
    () =>
      heads.filter(
        (h) =>
          h.name.toLowerCase().includes(search.toLowerCase()) ||
          h.type.toLowerCase().includes(search.toLowerCase()),
      ),
    [heads, search],
  );

  const total = filtered.length;
  const pageRows = filtered.slice(page * show, page * show + show);
  const start = total === 0 ? 0 : page * show + 1;
  const end = Math.min((page + 1) * show, total);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!headName.trim() || !headType) return;
    setHeads((prev) => [...prev, { id: `HEAD-${Date.now()}`, name: headName.trim(), type: headType }]);
    setHeadName("");
    setHeadType("");
  }

  function removeHead(id: string) {
    setHeads((prev) => prev.filter((h) => h.id !== id));
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
      {/* Form card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-center text-xl font-black text-gray-900">Add chart of accounts</h2>
        <form onSubmit={handleSave} className="space-y-5">
          <Field label="Head Name" required>
            <input
              value={headName}
              onChange={(e) => setHeadName(e.target.value)}
              placeholder="Name Of Head"
              className={inputCls}
            />
          </Field>
          <Field label="Head Type" required>
            <div className="relative">
              <select
                value={headType}
                onChange={(e) => setHeadType(e.target.value)}
                className={cn(inputCls, "appearance-none pr-10")}
                style={{ color: headType ? "#111827" : "#6b7280" }}
              >
                <option value="" style={{ color: "#6b7280" }}>Select</option>
                {HEAD_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </Field>
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-amber-400 px-8 text-sm font-black text-white shadow transition hover:bg-amber-500"
            >
              <Save className="h-4 w-4" />
              Save Head
            </button>
          </div>
        </form>
      </div>

      {/* Table card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            Show
            <select
              value={show}
              onChange={(e) => { setShow(Number(e.target.value)); setPage(0); }}
              className="rounded-lg border border-gray-200 px-2 py-1 text-sm outline-none focus:border-primary"
            >
              {[10, 25, 50, 100].map((n) => <option key={n}>{n}</option>)}
            </select>
            entries
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            Search:
            <div className="relative">
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                className="h-9 rounded-xl border border-gray-200 pl-3 pr-8 text-sm outline-none focus:border-primary"
              />
              <Search className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                {["NAME OF HEAD", "TYPE", "ACTION"].map((col) => (
                  <th key={col} className="px-5 py-3 text-[11px] font-black uppercase tracking-wider text-gray-700">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-10 text-center text-sm text-gray-400">
                    No data available in table
                  </td>
                </tr>
              ) : (
                pageRows.map((row) => (
                  <tr key={row.id} className="transition hover:bg-gray-50">
                    <td className="px-5 py-3 font-bold text-gray-900">{row.name}</td>
                    <td className="px-5 py-3 text-gray-600">{row.type}</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => removeHead(row.id)}
                        className="rounded-lg p-1.5 text-red-500 transition hover:bg-red-50"
                        title="Remove"
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 text-sm text-gray-600">
          <span>Showing {start} to {end} of {total} entries</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1 text-primary transition hover:underline disabled:text-gray-400 disabled:no-underline"
              type="button"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={end >= total}
              className="px-3 py-1 text-primary transition hover:underline disabled:text-gray-400 disabled:no-underline"
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Add Income ───────────────────────────────────────────────────────────────

function AddIncomeTab() {
  const [date, setDate] = useState(todayIso());
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !description.trim() || !amount) return;
    setDescription("");
    setAmount("");
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-center text-xl font-black text-gray-900">Add income</h2>
        <form onSubmit={handleAdd} className="space-y-5">
          <Field label="Date" required>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Description" required>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Income Description"
              className={inputCls}
            />
          </Field>
          <Field label="Amount" required>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Income Amount"
              className={inputCls}
            />
          </Field>
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-amber-400 px-8 text-sm font-black text-white shadow transition hover:bg-amber-500"
            >
              + Add Income
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Add Expense ──────────────────────────────────────────────────────────────

function AddExpenseTab() {
  const [date, setDate] = useState(todayIso());
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !description.trim() || !amount) return;
    setDescription("");
    setAmount("");
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-center text-xl font-black text-gray-900">Add expense</h2>
        <form onSubmit={handleAdd} className="space-y-5">
          <Field label="Date" required>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Description" required>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Expense Description"
              className={inputCls}
            />
          </Field>
          <Field label="Amount" required>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Expense Amount"
              className={inputCls}
            />
          </Field>
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-amber-400 px-8 text-sm font-black text-white shadow transition hover:bg-amber-500"
            >
              + Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Account Statement ────────────────────────────────────────────────────────

function AccountStatementTab() {
  const [dateFrom, setDateFrom] = useState(firstOfMonthIso());
  const [dateTo, setDateTo] = useState(todayIso());
  const [showRangePanel, setShowRangePanel] = useState(false);
  const [showRefs, setShowRefs] = useState(false);
  const [rows, setRows] = useState<StatementRow[]>([]);
  const [search, setSearch] = useState("");
  const rangeRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          r.description.toLowerCase().includes(search.toLowerCase()) ||
          r.date.includes(search),
      ),
    [rows, search],
  );

  const totalDebit = filtered.reduce((s, r) => s + r.debit, 0);
  const totalCredit = filtered.reduce((s, r) => s + r.credit, 0);
  const netBalance = totalDebit - totalCredit;

  function handleDelete() {
    if (!window.confirm("Delete all statement entries for this period?")) return;
    setRows([]);
  }

  return (
    <div className="space-y-4">
      {/* Controls bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative" ref={rangeRef}>
          <button
            onClick={() => setShowRangePanel((v) => !v)}
            className="flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-3 text-white shadow transition hover:bg-amber-500"
            type="button"
          >
            <CalendarDays className="h-5 w-5" />
            <span className="text-sm font-bold">
              {fmtDate(dateFrom)} – {fmtDate(dateTo)}
            </span>
            <ChevronDown className="h-4 w-4" />
          </button>
          {showRangePanel ? (
            <div className="absolute left-0 top-full z-20 mt-2 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-lg">
              <div className="space-y-1">
                <label className="ml-1 text-[11px] font-bold uppercase tracking-widest text-gray-500">From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="ml-1 text-[11px] font-bold uppercase tracking-widest text-gray-500">To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <button
                onClick={() => setShowRangePanel(false)}
                className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white transition hover:bg-primary/90"
                type="button"
              >
                Apply
              </button>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-gray-700">
            <button
              role="switch"
              aria-checked={showRefs}
              onClick={() => setShowRefs((v) => !v)}
              className={cn(
                "relative inline-flex h-5 w-9 items-center rounded-full transition",
                showRefs ? "bg-primary" : "bg-gray-300",
              )}
              type="button"
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 rounded-full bg-white shadow transition",
                  showRefs ? "translate-x-4" : "translate-x-0.5",
                )}
              />
            </button>
            Show References
          </label>
          <button
            onClick={() => setRows([])}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 px-4 py-2 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
            type="button"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Profit
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-400 px-4 py-2 text-sm font-bold text-red-500 transition hover:bg-red-50"
            type="button"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Table card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 pt-5">
          <div className="flex flex-wrap gap-2">
            {["Copy", "CSV", "Excel", "PDF", "Print"].map((label) => (
              <button
                key={label}
                className="rounded-full border border-gray-300 px-3 py-1 text-xs font-bold text-gray-600 transition hover:bg-gray-50"
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            Search:
            <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 rounded-xl border border-gray-200 pl-3 pr-8 text-sm outline-none focus:border-primary"
              />
              <Search className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                {["Date", "Description", "Debt", "Credit", "Net Balance"].map((col) => (
                  <th key={col} className="px-5 py-3 text-[11px] font-black uppercase tracking-wider text-gray-700">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-400">
                    No data available in table
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row.id} className="transition hover:bg-gray-50">
                    <td className="px-5 py-3 text-gray-600">{fmtDate(row.date)}</td>
                    <td className="px-5 py-3 text-gray-900">{row.description}</td>
                    <td className="px-5 py-3 text-gray-900">{money(row.debit)}</td>
                    <td className="px-5 py-3 text-gray-900">{money(row.credit)}</td>
                    <td className="px-5 py-3 text-gray-900">{money(row.debit - row.credit)}</td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-200">
                <td className="px-5 py-3" colSpan={2} />
                <td className="px-5 py-3 text-sm font-black text-gray-900">{money(totalDebit)}</td>
                <td className="px-5 py-3 text-sm font-black text-gray-900">{money(totalCredit)}</td>
                <td className="px-5 py-3 text-sm font-black text-gray-900">{money(netBalance)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="border-t border-gray-100 px-5 py-3 text-sm text-gray-600">
          Showing 0 to 0 of {filtered.length} entries
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function AccountsView({ activeSubtab }: { activeSubtab: string }) {
  if (activeSubtab === "Add Income") return <AddIncomeTab />;
  if (activeSubtab === "Add Expense") return <AddExpenseTab />;
  if (activeSubtab === "Account Statement") return <AccountStatementTab />;
  return <ChartOfAccountTab />;
}
