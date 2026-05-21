"use client";

import React from "react";

/* ─── Global print CSS ─────────────────────────────────────────────────────── */
const PRINT_STYLES = `
@media print {
  /* Hide everything except the print container */
  body * { visibility: hidden !important; }
  .print-only-container,
  .print-only-container * { visibility: visible !important; }
  .print-only-container {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 36px 48px !important;
    background: white !important;
    display: block !important;
    box-shadow: none !important;
  }
  /* Strip all navigation chrome */
  header, aside, nav, footer,
  [role="navigation"], .no-print { display: none !important; }

  @page { size: A4; margin: 0.6in; }

  /* ── Print table ── */
  .pt-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
    margin-top: 0;
  }
  .pt-table thead tr { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .pt-table th {
    background-color: #F59E0B !important;
    color: #ffffff !important;
    padding: 9px 12px;
    font-size: 9px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    border: 1px solid #D97706;
    white-space: nowrap;
  }
  .pt-table td {
    padding: 7px 12px;
    font-size: 11px;
    color: #111827;
    border: 1px solid #E5E7EB;
    vertical-align: middle;
  }
  .pt-table tbody tr:nth-child(even) td { background-color: #FFFBEB !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .pt-table tbody tr:nth-child(odd)  td { background-color: #ffffff !important; }
  .pt-table tfoot td {
    background-color: #F9FAFB !important;
    font-weight: 700;
    border-top: 2px solid #D97706;
  }
  .pt-td-highlight { color: #F59E0B !important; font-weight: 700 !important; }
  .pt-td-muted     { color: #6B7280 !important; }
  .pt-td-bold      { font-weight: 700 !important; }
  .pt-td-red       { color: #EF4444 !important; font-weight: 700 !important; }
  .pt-td-green     { color: #10B981 !important; font-weight: 700 !important; }

  /* ── Info grid ── */
  .pt-info-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px 24px;
    margin: 16px 0;
  }
  .pt-info-label {
    font-size: 9px; font-weight: 700;
    color: #6B7280; text-transform: uppercase; letter-spacing: 0.08em; display: block;
  }
  .pt-info-value {
    font-size: 11px; font-weight: 700; color: #111827; margin-top: 2px; display: block;
  }
  .pt-info-value-highlight { color: #F59E0B !important; }

  /* ── Section divider ── */
  .pt-section {
    border-top: 1px solid #E5E7EB;
    margin-top: 16px;
    padding-top: 14px;
  }
  .pt-section-title {
    font-size: 9px; font-weight: 800; color: #6B7280;
    text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px;
  }
}
`;

/* ─── Campus One logo icon ──────────────────────────────────────────────────── */
function SchoolIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
      stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  );
}

/* ─── Main wrapper ──────────────────────────────────────────────────────────── */
interface PrintTemplateProps {
  /** Document title shown in the amber banner, e.g. "Admission Letter" */
  title: string;
  /** Optional subtitle below the title */
  subtitle?: string;
  /** Print date override; defaults to today */
  date?: string;
  children: React.ReactNode;
}

export function PrintTemplate({ title, subtitle, date, children }: PrintTemplateProps) {
  const printDate =
    date ||
    new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="print-only-container hidden print:block bg-white text-black font-sans">
      {/* Inject print CSS */}
      <style dangerouslySetInnerHTML={{ __html: PRINT_STYLES }} />

      {/* ── Header ── */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", borderBottom: "2px solid #E5E7EB", paddingBottom: "14px" }}>
        {/* Logo */}
        <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "#FFFBEB", border: "1px solid #FDE68A", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
          <SchoolIcon />
        </div>

        {/* School name */}
        <h1 style={{ margin: 0, fontSize: "26px", fontWeight: 900, color: "#1F2937", letterSpacing: "-0.5px" }}>
          Campus One
        </h1>
        <p style={{ margin: "2px 0 0", fontSize: "9px", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "3px" }}>
          &ldquo; YOUR SCHOOL SOFTWARE &rdquo;
        </p>
        <p style={{ margin: "4px 0 0", fontSize: "8px", color: "#9CA3AF", fontWeight: 600 }}>
          +923460204447 | www.campusone.com | info@campusone.com
        </p>

        {/* Document title banner */}
        <div style={{ width: "100%", margin: "12px 0 0", padding: "10px 0", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB" }}>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 900, color: "#F59E0B", textTransform: "uppercase", letterSpacing: "3px" }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ margin: "4px 0 0", fontSize: "9px", color: "#6B7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
              {subtitle}
            </p>
          )}
        </div>

        <p style={{ margin: "8px 0 0", fontSize: "8px", color: "#9CA3AF" }}>
          Generated On: {printDate}
        </p>
      </div>

      {/* ── Body ── */}
      <div style={{ marginTop: "20px" }}>
        {children}
      </div>

      {/* ── Footer ── */}
      <div style={{ marginTop: "40px", paddingTop: "12px", borderTop: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ margin: 0, fontSize: "8px", color: "#9CA3AF", fontStyle: "italic" }}>
          This is a system-generated document.
        </p>
        <p style={{ margin: 0, fontSize: "8px", color: "#9CA3AF", fontWeight: 700 }}>
          Campus One — Your School Software
        </p>
      </div>
    </div>
  );
}

/* ─── Styled table helpers ──────────────────────────────────────────────────── */

export function PrintTable({ children }: { children: React.ReactNode }) {
  return (
    <table className="pt-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
      {children}
    </table>
  );
}

export function PrintThead({ children }: { children: React.ReactNode }) {
  return (
    <thead style={{ backgroundColor: "#F59E0B" }}>
      {children}
    </thead>
  );
}

export function PrintTh({ children }: { children: React.ReactNode }) {
  return (
    <th style={{ backgroundColor: "#F59E0B", color: "#fff", padding: "9px 12px", fontSize: "9px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", border: "1px solid #D97706", whiteSpace: "nowrap" }}>
      {children}
    </th>
  );
}

type TdVariant = "default" | "highlight" | "muted" | "bold" | "red" | "green";

const tdColor: Record<TdVariant, string> = {
  default:   "#111827",
  highlight: "#F59E0B",
  muted:     "#6B7280",
  bold:      "#111827",
  red:       "#EF4444",
  green:     "#10B981",
};

export function PrintTd({ children, variant = "default" }: { children: React.ReactNode; variant?: TdVariant }) {
  return (
    <td style={{ padding: "7px 12px", fontSize: "11px", color: tdColor[variant], fontWeight: variant === "bold" || variant === "highlight" || variant === "red" || variant === "green" ? 700 : "normal", border: "1px solid #E5E7EB", verticalAlign: "middle" }}>
      {children}
    </td>
  );
}

/* ─── Key-value info grid (3 columns) ──────────────────────────────────────── */
interface InfoItem {
  label: string;
  value?: string | number | null;
  highlight?: boolean;
}

export function PrintInfoGrid({ items, columns = 3 }: { items: InfoItem[]; columns?: 2 | 3 | 4 }) {
  return (
    <div className="pt-info-grid" style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: "14px 24px", margin: "16px 0" }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column" }}>
          <span className="pt-info-label" style={{ fontSize: "9px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {item.label}
          </span>
          <span className="pt-info-value" style={{ fontSize: "11px", fontWeight: 700, color: item.highlight ? "#F59E0B" : "#111827", marginTop: "2px" }}>
            ↳ {item.value ?? "—"}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Section divider with title ───────────────────────────────────────────── */
export function PrintSection({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="pt-section" style={{ borderTop: "1px solid #E5E7EB", marginTop: "16px", paddingTop: "14px" }}>
      {title && (
        <p className="pt-section-title" style={{ fontSize: "9px", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px", margin: "0 0 10px" }}>
          {title}
        </p>
      )}
      {children}
    </div>
  );
}
