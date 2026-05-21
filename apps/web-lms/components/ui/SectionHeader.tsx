"use client";

import { useState } from "react";

type SectionHeaderProps = {
  title: string;
  description: string;
  action?: string;
};

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  const [status, setStatus] = useState<string>("");

  async function handleAction() {
    if (!action) {
      return;
    }

    setStatus("Saving...");

    const response = await fetch("/api/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module: title, label: action }),
    });

    setStatus(response.ok ? "Action saved" : "Action failed");
  }

  return (
    <div className="flex items-start justify-between gap-8 pb-8 border-b border-gray-200 mb-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {title}
        </h1>
        {description ? <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-gray-500 font-medium">{description}</p> : null}
      </div>
      {action ? (
        <div className="flex shrink-0 flex-col items-end gap-2">
          <button
            className="h-11 rounded-xl bg-[#F59E0B] px-6 text-sm font-semibold text-white shadow-lg hover:bg-[#D97706] transition-colors"
            onClick={handleAction}
            type="button"
          >
            {action}
          </button>
          {status ? <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{status}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
