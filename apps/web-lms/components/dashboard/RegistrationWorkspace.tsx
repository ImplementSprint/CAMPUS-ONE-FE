"use client";

import { FormEvent, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import type { SchoolProfile } from "@/lib/backend/types";
import { cn } from "@/lib/utils";
import { Plus, Trash2, Shield, Lock, CreditCard, Building, FileText, Star, Eye, Globe, DollarSign, UserCog } from "lucide-react";

const initialSchool: SchoolProfile = {
  id: "school-demo",
  name: "",
  representative: "",
  email: "",
  contactNumber: "",
  schoolType: "",
  targetSubdomain: "",
  status: "draft",
  setupProgress: 0,
};

const fields = [
  { key: "name", label: "Institute Name", placeholder: "" },
  { key: "representative", label: "Representative", placeholder: "" },
  { key: "email", label: "Official Email", placeholder: "" },
  { key: "contactNumber", label: "Contact Number", placeholder: "" },
  { key: "schoolType", label: "School Type", placeholder: "" },
  { key: "targetSubdomain", label: "Target Subdomain", placeholder: "" },
] as const;

export function RegistrationWorkspace() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "institute-profile";
  
  const [school, setSchool] = useState<SchoolProfile>(initialSchool);
  const [message, setMessage] = useState("Loading registration details...");

  async function loadSchool() {
    const response = await fetch("/api/school");
    if (!response.ok) { setMessage(""); return; }
    const data = await response.json();
    setSchool({
      id: data.id ?? "school-demo",
      name: data.name ?? "",
      representative: data.representative ?? "",
      email: data.email ?? "",
      contactNumber: data.contact_number ?? "",
      schoolType: data.school_type ?? "",
      targetSubdomain: data.target_subdomain ?? "",
      status: data.status ?? "draft",
      setupProgress: data.setup_progress ?? 0,
    });
    setMessage("");
  }

  useEffect(() => {
    void loadSchool();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "institute-profile":
        return <InstituteProfileForm school={school} setSchool={setSchool} message={message} setMessage={setMessage} />;
      case "fees-particulars":
        return <FeesParticularsView />;
      case "accounts-fees-invoice":
        return <AccountsFeesInvoiceView />;
      case "rules-regulations":
        return <RulesRegulationsView />;
      case "marks-grading":
        return <MarksGradingView />;
      case "account-settings":
        return <AccountSettingsView />;
      default:
        return (
          <div className="rounded-2xl border border-dashed border-gray-200 p-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Module Active</h3>
            <p className="text-gray-500 max-w-xs">This settings module is active and ready for configuration.</p>
          </div>
        );
    }
  };

  return (
    <section className="w-full">
      {renderContent()}
    </section>
  );
}

function InstituteProfileForm({ school, setSchool, message, setMessage }: { school: SchoolProfile, setSchool: any, message: string, setMessage: any }) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Saving registration details...");
    const response = await fetch("/api/school", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(school),
    });
    if (response.ok) {
      const data = await response.json();
      setSchool({
        id: data.id ?? school.id,
        name: data.name ?? "",
        representative: data.representative ?? "",
        email: data.email ?? "",
        contactNumber: data.contact_number ?? "",
        schoolType: data.school_type ?? "",
        targetSubdomain: data.target_subdomain ?? "",
        status: data.status ?? "draft",
        setupProgress: data.setup_progress ?? 0,
      });
      setMessage("Profile updated successfully.");
    } else {
      setMessage("Failed to save. Please try again.");
    }
  }

  return (
    <form className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2 flex items-center gap-6 p-6 rounded-2xl bg-gray-50 border border-gray-200">
          <div className="w-24 h-24 rounded-2xl bg-primary/10 border-2 border-dashed border-primary/20 flex items-center justify-center">
            <Building className="w-10 h-10 text-primary/40" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Institute Logo</p>
            <button type="button" onClick={() => document.getElementById('institute-logo-upload')?.click()} className="bg-[#F59E0B] text-white px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider hover:bg-[#D97706] transition-colors">Change Logo</button>
            <input type="file" id="institute-logo-upload" className="hidden" accept="image/*" onChange={(e) => {
              if (e.target.files?.[0]) alert(`Logo ${e.target.files[0].name} selected! (Simulation)`);
            }} />
          </div>
        </div>
        {fields.map((field) => (
          <label key={field.key} className="block group">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-1 group-focus-within:text-[#F59E0B] transition-colors">
              {field.label} <span className="text-red-500">*</span>
            </span>
            <input
              className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/10 placeholder:text-gray-500/20"
              onChange={(event) => {
                let val = event.target.value;
                if (field.key === "contactNumber") val = val.replace(/\D/g, "");
                setSchool((current: any) => ({ ...current, [field.key]: val }));
              }}
              placeholder={field.placeholder}
              type={field.key === "contactNumber" ? "tel" : "text"}
              value={school[field.key]}
              required
            />
          </label>
        ))}
      </div>

      <div className="mt-10 pt-8 border-t border-gray-200 flex items-center justify-between">
        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest italic">{message}</p>
        <button className="rounded-xl bg-primary px-8 py-3.5 text-[13px] font-black text-white hover:scale-[1.02] transition-all active:scale-[0.98] shadow-xl shadow-primary/20 uppercase tracking-widest" type="submit">
          Update Profile
        </button>
      </div>
    </form>
  );
}

function FeesParticularsView() {
  const [particulars, setParticulars] = useState<{ label: string; amount: string }[]>(
    Array.from({ length: 9 }, () => ({ label: "", amount: "" }))
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("fees-particulars");
    if (saved) {
      try {
        setParticulars(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleChange = (index: number, field: "label" | "amount", value: string) => {
    setParticulars((prev) => {
      const copy = [...prev];
      let val = value;
      if (field === "amount") {
        val = val.replace(/\D/g, ""); // Allow numbers only
      }
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Dynamic validation:
    // If a label is filled, the amount must be filled.
    // If an amount is filled, the label must be filled.
    for (let i = 0; i < particulars.length; i++) {
      const row = particulars[i];
      if ((row.label && !row.amount) || (!row.label && row.amount)) {
        setMessage(`Row ${i + 1} is incomplete. Please provide both a label and an amount.`);
        return;
      }
    }

    localStorage.setItem("fees-particulars", JSON.stringify(particulars));
    setMessage("Particulars saved successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <form className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm" onSubmit={handleSubmit}>
      {/* Branded Tip Box */}
      <div className="mb-8 p-6 rounded-2xl bg-primary/5 border border-primary/20 flex gap-4 items-start">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <DollarSign className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="text-[11px] font-bold text-gray-900 uppercase tracking-widest mb-1">💡 Guide & Examples</h4>
          <p className="text-[13px] text-gray-600 font-medium leading-relaxed">
            Enter the standard fee categories for your school. 
            Label examples: <span className="font-bold text-gray-900">Tuition Fee</span>, <span className="font-bold text-gray-900">Admission Fee</span>, <span className="font-bold text-gray-900">Library Fee</span>. 
            Amount examples: <span className="font-bold text-gray-900">5000</span>, <span className="font-bold text-gray-900">1500</span>, <span className="font-bold text-gray-900">300</span> (numbers only).
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {particulars.map((row, i) => {
          const isRequired = i === 0;
          return (
            <div key={i} className="flex items-center gap-4 group">
              <div className="flex-1">
                <label className="block">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
                    Particular Label {isRequired && <span className="text-red-500">*</span>}
                  </span>
                  <input
                    className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-5 text-sm text-gray-900 outline-none focus:border-[#F59E0B] transition-all"
                    placeholder={i === 0 ? "e.g., Tuition Fee" : "e.g., Library Fee (Optional)"}
                    value={row.label}
                    onChange={(e) => handleChange(i, "label", e.target.value)}
                    required={isRequired}
                  />
                </label>
              </div>
              <div className="w-40">
                <label className="block">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
                    Prefix Amount {isRequired && <span className="text-red-500">*</span>}
                  </span>
                  <input
                    className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-5 text-sm text-gray-900 outline-none focus:border-[#F59E0B] transition-all"
                    placeholder={i === 0 ? "5000" : "300"}
                    value={row.amount}
                    onChange={(e) => handleChange(i, "amount", e.target.value)}
                    required={isRequired}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 pt-8 border-t border-gray-200 flex items-center justify-between">
        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest italic">{message}</p>
        <button 
          className="rounded-xl bg-primary px-8 py-3.5 text-[13px] font-black text-white hover:scale-[1.02] transition-all active:scale-[0.98] shadow-xl shadow-primary/20 uppercase tracking-widest" 
          type="submit"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

function AccountsFeesInvoiceView() {
  type BankEntry = { bankName: string; address: string; accountNumber: string; instructions: string };
  const [bankName, setBankName] = useState("");
  const [address, setAddress] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [instructions, setInstructions] = useState("");
  const [banks, setBanks] = useState<BankEntry[]>([]);
  const [formError, setFormError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try { const stored = localStorage.getItem("campus_fees_account"); if (stored) setBanks(JSON.parse(stored)); } catch {}
  }, []);

  function handleAddBank(e: FormEvent) {
    e.preventDefault(); setFormError("");
    if (!bankName.trim() || !accountNumber.trim()) { setFormError("Bank Name and Account Number are required."); return; }
    const entry: BankEntry = { bankName, address, accountNumber, instructions };
    const updated = [...banks, entry];
    setBanks(updated);
    localStorage.setItem("campus_fees_account", JSON.stringify(updated));
    setSaved(true);
    setBankName(""); setAddress(""); setAccountNumber(""); setInstructions("");
    setTimeout(() => setSaved(false), 2000);
  }

  function removeBank(index: number) {
    const updated = banks.filter((_, i) => i !== index);
    setBanks(updated);
    if (updated.length === 0) localStorage.removeItem("campus_fees_account");
    else localStorage.setItem("campus_fees_account", JSON.stringify(updated));
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.5fr] gap-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm h-fit">
        <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase mb-8 text-center">Add New Bank</h2>
        <form onSubmit={handleAddBank} className="space-y-5">
          <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 mb-2">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center"><Plus className="w-6 h-6 text-gray-500" /></div>
            <button type="button" onClick={() => document.getElementById('bank-logo-upload')?.click()} className="bg-primary text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] transition-transform">Choose Logo</button>
            <input type="file" id="bank-logo-upload" className="hidden" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) alert(`Logo ${e.target.files[0].name} selected!`); }} />
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Max size 500kb</p>
          </div>
          {[{ label: "Bank Name", value: bankName, set: setBankName, required: true }, { label: "Bank/Branch Address", value: address, set: setAddress, required: false }, { label: "Account Number", value: accountNumber, set: setAccountNumber, required: true }].map(({ label, value, set, required }) => (
            <label key={label} className="block">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">{label}{required && <span className="text-red-500 ml-0.5"> *</span>}</span>
              <input value={value} onChange={e => set(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition" placeholder={`Your ${label}`} />
            </label>
          ))}
          <label className="block">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Instructions</span>
            <textarea value={instructions} onChange={e => setInstructions(e.target.value)} className="mt-2 h-28 w-full rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-900 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition resize-none" placeholder="Write payment instructions..." />
          </label>
          {formError && <p className="text-xs text-red-500 font-medium">{formError}</p>}
          {saved && <p className="text-xs text-green-600 font-bold">Bank account saved!</p>}
          <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform active:scale-[0.98] shadow-xl shadow-primary/20">
            <Plus className="w-4 h-4" /> Add Bank
          </button>
        </form>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm h-fit">
        <div className="p-6 border-b border-gray-200 bg-gray-50"><h3 className="font-bold text-gray-900 uppercase text-[11px] tracking-widest">Active Bank Accounts</h3></div>
        <table className="w-full text-left text-[13px]">
          <thead className="bg-primary text-white text-[10px] font-black uppercase tracking-widest">
            <tr><th className="px-6 py-4">Bank Name</th><th className="px-6 py-4">Account No.</th><th className="px-6 py-4">Address</th><th className="px-6 py-4">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {banks.length === 0 ? (
              <tr className="bg-gray-50"><td colSpan={4} className="px-6 py-16 text-center text-gray-400 uppercase font-bold tracking-widest text-xs">No bank accounts added yet</td></tr>
            ) : banks.map((b, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
                <td className="px-6 py-4 font-semibold text-gray-900">{b.bankName}</td>
                <td className="px-6 py-4 text-gray-600 font-mono">{b.accountNumber}</td>
                <td className="px-6 py-4 text-gray-500">{b.address || "—"}</td>
                <td className="px-6 py-4"><button onClick={() => removeBank(i)} className="px-3 py-1.5 text-[11px] font-bold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RulesRegulationsView() {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("rules-regulations");
    if (saved) {
      setText(saved);
    } else {
      setText(
        "1. Attendance: Students must maintain at least 75% attendance.\n" +
        "2. Uniform: Standard campus uniform must be worn at all times.\n" +
        "3. Conduct: Maintain discipline and respect in the campus premises."
      );
    }
  }, []);

  const applyFormat = (type: "bold" | "italic" | "underline" | "doc" | "star") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);

    let formatted = "";
    let newCursorPos = start;

    if (type === "bold") {
      formatted = `**${selectedText || "bold text"}**`;
      newCursorPos += 2;
    } else if (type === "italic") {
      formatted = `*${selectedText || "italic text"}*`;
      newCursorPos += 1;
    } else if (type === "underline") {
      formatted = `__${selectedText || "underlined text"}__`;
      newCursorPos += 2;
    } else if (type === "doc") {
      formatted = "\n--- STANDARD INSTITUTE POLICY ---\nThis document details the code of conduct for all members of the campus.\n";
    } else if (type === "star") {
      formatted = "⭐ ";
    }

    const newText = text.substring(0, start) + formatted + text.substring(end);
    setText(newText);

    // Focus back and set selection
    setTimeout(() => {
      textarea.focus();
      const offset = formatted.length - (end - start);
      textarea.setSelectionRange(start + offset, start + offset);
    }, 50);
  };

  const handleSave = () => {
    localStorage.setItem("rules-regulations", text);
    setMessage("Rules and regulations saved successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-inner">
        <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center gap-4">
           <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
             <button 
               type="button" 
               onClick={() => applyFormat("bold")} 
               className="w-8 h-8 rounded hover:bg-gray-200 flex items-center justify-center font-bold text-gray-900 transition-colors"
               title="Bold"
             >
               B
             </button>
             <button 
               type="button" 
               onClick={() => applyFormat("italic")} 
               className="w-8 h-8 rounded hover:bg-gray-200 flex items-center justify-center italic text-gray-900 transition-colors"
               title="Italic"
             >
               I
             </button>
             <button 
               type="button" 
               onClick={() => applyFormat("underline")} 
               className="w-8 h-8 rounded hover:bg-gray-200 flex items-center justify-center underline text-gray-900 transition-colors"
               title="Underline"
             >
               U
             </button>
           </div>
           <div className="flex items-center gap-2">
             <button 
               type="button" 
               onClick={() => applyFormat("doc")} 
               className="w-8 h-8 rounded hover:bg-gray-200 flex items-center justify-center transition-colors"
               title="Insert Document Template"
             >
               <FileText className="w-4 h-4 text-gray-900" />
             </button>
             <button 
               type="button" 
               onClick={() => applyFormat("star")} 
               className="w-8 h-8 rounded hover:bg-gray-200 flex items-center justify-center transition-colors"
               title="Insert Star Emoji"
             >
               <Star className="w-4 h-4 text-gray-900" />
             </button>
           </div>
        </div>
        <textarea 
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-96 bg-transparent p-8 text-gray-700 outline-none resize-none font-medium text-base placeholder:text-gray-400"
          placeholder="Type institute rules and regulations here..."
        />
      </div>
      <div className="mt-8 flex items-center justify-between">
        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest italic">{message}</p>
        <button 
          type="button"
          onClick={handleSave}
          className="bg-primary text-white px-10 py-4 rounded-xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

interface GradingRow {
  grade: string;
  from: string;
  upto: string;
  point: string;
}

function MarksGradingView() {
  const [grades, setGrades] = useState<GradingRow[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("marks-grading");
    if (saved) {
      setGrades(JSON.parse(saved));
    } else {
      setGrades([
        { grade: "A+", from: "90", upto: "100", point: "4.0" },
        { grade: "A", from: "80", upto: "89", point: "3.5" },
        { grade: "B", from: "70", upto: "79", point: "3.0" },
        { grade: "C", from: "60", upto: "69", point: "2.0" },
        { grade: "F", from: "0", upto: "59", point: "0.0" }
      ]);
    }
  }, []);

  const handleChange = (index: number, field: keyof GradingRow, value: string) => {
    const updated = [...grades];
    updated[index][field] = value;
    setGrades(updated);
  };

  const handleAdd = () => {
    setGrades([...grades, { grade: "", from: "", upto: "", point: "" }]);
  };

  const handleRemove = (index: number) => {
    setGrades(grades.filter((_, idx) => idx !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("marks-grading", JSON.stringify(grades));
    setMessage("Grading configuration saved successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <form onSubmit={handleSave} className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      {/* Branded Guide Box */}
      <div className="mb-8 p-6 rounded-2xl bg-primary/5 border border-primary/20 flex gap-4 items-start">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="text-[11px] font-bold text-gray-900 uppercase tracking-widest mb-1">💡 Marks & Grading Guide</h4>
          <p className="text-[13px] text-gray-600 font-medium leading-relaxed">
            Define your school's standard grading scales. All fields are required for each row. 
            Example: Grade <span className="font-bold text-gray-900">A+</span> from <span className="font-bold text-gray-900">90%</span> to <span className="font-bold text-gray-900">100%</span> with Grade Point <span className="font-bold text-gray-900">4.0</span>.
          </p>
        </div>
      </div>

      <div className="space-y-6 max-w-5xl mx-auto">
        {grades.map((row, i) => (
          <div key={i} className="grid grid-cols-[1fr_0.8fr_0.8fr_1fr_auto] gap-4 items-end group border-b border-gray-50 pb-4 last:border-0 last:pb-0">
             <div>
                <label className="block">
                  <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">
                    Grade Name <span className="text-red-500">*</span>
                  </span>
                  <input 
                    required
                    value={row.grade}
                    onChange={(e) => handleChange(i, "grade", e.target.value)}
                    placeholder="e.g., A+"
                    className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 font-bold outline-none focus:border-[#F59E0B] transition-colors" 
                  />
                </label>
             </div>
             <div>
                <label className="block">
                  <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">
                    % From <span className="text-red-500">*</span>
                  </span>
                  <input 
                    required
                    value={row.from}
                    onChange={(e) => handleChange(i, "from", e.target.value)}
                    placeholder="90"
                    className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 font-bold outline-none focus:border-[#F59E0B] transition-colors" 
                  />
                </label>
             </div>
             <div>
                <label className="block">
                  <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">
                    % Upto <span className="text-red-500">*</span>
                  </span>
                  <input 
                    required
                    value={row.upto}
                    onChange={(e) => handleChange(i, "upto", e.target.value)}
                    placeholder="100"
                    className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 font-bold outline-none focus:border-[#F59E0B] transition-colors" 
                  />
                </label>
             </div>
             <div>
                <label className="block">
                  <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">
                    Grade Point <span className="text-red-500">*</span>
                  </span>
                  <input 
                    required
                    value={row.point}
                    onChange={(e) => handleChange(i, "point", e.target.value)}
                    placeholder="4.0"
                    className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 font-bold outline-none focus:border-[#F59E0B] transition-colors" 
                  />
                </label>
             </div>
             <div>
               <button 
                 type="button"
                 onClick={() => handleRemove(i)}
                 className="h-11 w-11 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 flex items-center justify-center transition-all group-hover:opacity-100"
                 title="Remove Row"
               >
                 <Trash2 className="w-4 h-4" />
               </button>
             </div>
          </div>
        ))}
      </div>
      
      <div className="mt-10 pt-8 border-t border-gray-200 flex items-center justify-between">
        <button 
          type="button"
          onClick={handleAdd}
          className="bg-primary/10 text-primary border border-primary/20 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-primary hover:text-white transition-all"
        >
          <Plus className="w-4 h-4" /> Add More Option
        </button>
        <div className="flex items-center gap-6">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest italic">{message}</p>
          <button 
            type="submit"
            className="bg-primary text-white px-12 py-4 rounded-xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </form>
  );
}

function AccountSettingsView() {
  const [settings, setSettings] = useState({
    username: "",
    password: "",
    timezone: "",
    currency: "",
    symbol: "",
    subscription: "Premium Enterprise",
    expiry: "May 18, 2028"
  });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCompleted, setDeleteCompleted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("account-settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSettings({ ...parsed, currency: "PHP", symbol: "₱" });
    } else {
      setSettings({
        username: "admin_campus_one",
        password: "SuperSecretPassword123",
        timezone: "Asia/Manila (UTC+08:00)",
        currency: "PHP",
        symbol: "₱",
        subscription: "Premium Enterprise",
        expiry: "May 18, 2028"
      });
    }
  }, []);

  const currencies = [
    { code: "PHP", symbol: "₱", label: "Philippine Peso (PHP)" },
  ];

  const timezones = [
    "Asia/Manila (UTC+08:00)",
    "Asia/Tokyo (UTC+09:00)",
    "Asia/Singapore (UTC+08:00)",
    "Asia/Hong_Kong (UTC+08:00)",
    "Europe/London (UTC+00:00)",
    "America/New_York (UTC-05:00)",
    "America/Los_Angeles (UTC-08:00)",
    "Europe/Paris (UTC+01:00)",
    "Australia/Sydney (UTC+10:00)"
  ];

  const handleCurrencyChange = (code: string) => {
    const found = currencies.find(c => c.code === code);
    setSettings(prev => ({
      ...prev,
      currency: code,
      symbol: found ? found.symbol : prev.symbol
    }));
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("account-settings", JSON.stringify(settings));
    setMessage("Account settings updated successfully!");
    setTimeout(() => setMessage(""), 4000);
  };

  const handleDeleteConfirm = () => {
    setDeleteCompleted(true);
    localStorage.removeItem("account-settings");
    setTimeout(() => {
      setShowDeleteModal(false);
      setDeleteCompleted(false);
      // Reset settings
      setSettings({
        username: "admin_campus_one",
        password: "SuperSecretPassword123",
        timezone: "Asia/Manila (UTC+08:00)",
        currency: "PHP",
        symbol: "₱",
        subscription: "Premium Enterprise",
        expiry: "May 18, 2028"
      });
    }, 2000);
  };

  return (
    <div className="relative">
      <form onSubmit={handleUpdate} className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm">
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
              <label className="block">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
                  Username <span className="text-red-500">*</span>
                </span>
                <input 
                  required
                  value={settings.username}
                  onChange={(e) => setSettings(prev => ({ ...prev, username: e.target.value }))}
                  className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-5 text-sm text-gray-900 outline-none focus:border-[#F59E0B] transition-all font-bold placeholder:text-gray-400" 
                />
              </label>

              <label className="block">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
                  Password <span className="text-red-500">*</span>
                </span>
                <div className="relative mt-2">
                  <input 
                    required
                    type={showPassword ? "text" : "password"}
                    value={settings.password}
                    onChange={(e) => setSettings(prev => ({ ...prev, password: e.target.value }))}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white px-5 text-sm text-gray-900 outline-none focus:border-[#F59E0B] transition-all pr-12 font-bold" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-80 focus:outline-none"
                  >
                    <Eye className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </label>

              <label className="block">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
                  TimeZone <span className="text-red-500">*</span>
                </span>
                <select 
                  required
                  value={settings.timezone}
                  onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                  className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-5 text-sm text-gray-900 outline-none focus:border-[#F59E0B] transition-all font-bold"
                >
                  <option value="">Select timezone</option>
                  {timezones.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-6">
                 <label className="block">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
                    Currency <span className="text-red-500">*</span>
                  </span>
                  <input
                    readOnly
                    value="Philippine Peso (PHP)"
                    className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-5 text-sm text-gray-900 outline-none cursor-default font-bold"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
                    Symbol <span className="text-red-500">*</span>
                  </span>
                  <input 
                    required
                    value={settings.symbol}
                    onChange={(e) => setSettings(prev => ({ ...prev, symbol: e.target.value }))}
                    className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-5 text-sm text-gray-900 outline-none focus:border-[#F59E0B] transition-all font-bold" 
                  />
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex-1 mr-4">
                {message && (
                  <p className="text-[#F59E0B] font-bold text-xs uppercase tracking-widest transition-opacity duration-300 animate-pulse bg-amber-500/10 px-4 py-2.5 rounded-xl border border-amber-500/20">
                    🎉 {message}
                  </p>
                )}
              </div>
              <button 
                type="submit"
                className="bg-primary text-white px-10 py-4 rounded-xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <Globe className="w-4 h-4" /> Update Settings
              </button>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-10 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <Shield className="w-40 h-40 text-primary" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <Lock className="w-5 h-5 text-primary" />
                <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Account details</h3>
              </div>

              <div className="space-y-6 mb-10">
                {[
                  { label: "Username", value: settings.username || "—" },
                  { label: "Password", value: settings.password ? (showPassword ? settings.password : "••••••••") : "—" },
                  { label: "Subscription", value: settings.subscription, isBadge: true },
                  { label: "Expiry", value: settings.expiry },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{item.label}:</span>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-sm font-bold tracking-tight",
                        item.isBadge ? "bg-green-500/10 text-green-600 px-3 py-1 rounded-lg border border-green-500/20 text-[10px]" : "text-gray-900"
                      )}>
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="w-full bg-red-500/10 border border-red-500/20 text-red-500 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3"
              >
                <Trash2 className="w-4 h-4" /> Delete Account
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Stunning Custom Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-gray-200 p-8 max-w-md w-full mx-4 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500" />
            
            {!deleteCompleted ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
                  <Trash2 className="w-7 h-7 text-red-500 animate-bounce" />
                </div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Delete campus account?</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                  This action is irreversible. All student profiles, fee collections, grading settings, and configurations will be permanently deleted from the system.
                </p>
                
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={handleDeleteConfirm}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Yes, Delete Account
                  </button>
                </div>
              </>
            ) : (
              <div className="py-8 text-center flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                  <Globe className="w-7 h-7 text-green-500 animate-spin" />
                </div>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-2">Deleting Account...</h3>
                <p className="text-gray-500 text-xs italic">
                  Wiping configurations and restoring default state...
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
