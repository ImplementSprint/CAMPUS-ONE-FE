"use client";

import { FormEvent, useMemo, useState } from "react";
import { FileText, Plus, Search, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type EmployeePayroll = {
  id: string;
  employee: string;
  position: string;
  baseSalary: number;
  cycle: string;
  status: "Ready" | "Draft" | "On Hold";
};

type Allowance = {
  id: string;
  employeeId: string;
  name: string;
  amount: number;
};

const employees: EmployeePayroll[] = [
  { id: "EMP-2101", employee: "Carla Mendoza", position: "Science Teacher", baseSalary: 42000, cycle: "Monthly", status: "Ready" },
  { id: "EMP-2102", employee: "Rafael Dizon", position: "Registrar Staff", baseSalary: 36000, cycle: "Monthly", status: "Ready" },
  { id: "EMP-2103", employee: "Tessa Villanueva", position: "Guidance Counselor", baseSalary: 39000, cycle: "Monthly", status: "Draft" },
  { id: "EMP-2104", employee: "Marco Lim", position: "IT Support", baseSalary: 34000, cycle: "Semi-monthly", status: "On Hold" },
];

const initialAllowances: Allowance[] = [
  { id: "ALW-1", employeeId: "EMP-2101", name: "Transportation", amount: 2500 },
  { id: "ALW-2", employeeId: "EMP-2101", name: "Internet", amount: 1200 },
  { id: "ALW-3", employeeId: "EMP-2102", name: "Meal", amount: 1800 },
];

function money(value: number) {
  return new Intl.NumberFormat("en-PH", { currency: "PHP", style: "currency" }).format(value);
}

function statusClass(status: string) {
  if (status === "Ready") return "bg-green-50 text-green-700 border-green-200";
  if (status === "Draft") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-gray-50 text-gray-600 border-gray-200";
}

function PayrollTable({
  rows,
  allowances,
  onPreview,
}: {
  rows: EmployeePayroll[];
  allowances: Allowance[];
  onPreview?: (employeeId: string) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-left text-[13px]">
        <thead className="bg-primary text-[11px] font-black uppercase tracking-wider text-white">
          <tr>
            <th className="px-6 py-4">Employee</th>
            <th className="px-6 py-4">Position</th>
            <th className="px-6 py-4">Base Salary</th>
            <th className="px-6 py-4">Allowances</th>
            <th className="px-6 py-4">Cycle</th>
            <th className="px-6 py-4">Status</th>
            {onPreview ? <th className="px-6 py-4">Action</th> : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => {
            const totalAllowance = allowances.filter((item) => item.employeeId === row.id).reduce((sum, item) => sum + item.amount, 0);
            return (
              <tr key={row.id} className="transition hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-gray-900">{row.employee}</td>
                <td className="px-6 py-4 text-gray-600">{row.position}</td>
                <td className="px-6 py-4 text-gray-900">{money(row.baseSalary)}</td>
                <td className="px-6 py-4 text-gray-600">{money(totalAllowance)}</td>
                <td className="px-6 py-4 text-gray-600">{row.cycle}</td>
                <td className="px-6 py-4">
                  <span className={cn("rounded-full border px-3 py-1 text-[11px] font-bold", statusClass(row.status))}>{row.status}</span>
                </td>
                {onPreview ? (
                  <td className="px-6 py-4">
                    <button
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white transition hover:bg-primary/90"
                      onClick={() => onPreview(row.id)}
                      type="button"
                    >
                      <FileText className="h-4 w-4" />
                      Generate
                    </button>
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function SalaryView({ activeSubtab }: { activeSubtab: string }) {
  const [allowances, setAllowances] = useState<Allowance[]>(initialAllowances);
  const [search, setSearch] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(employees[0].id);
  const [allowanceName, setAllowanceName] = useState("");
  const [allowanceAmount, setAllowanceAmount] = useState("");
  const [payslipEmployeeId, setPayslipEmployeeId] = useState(employees[0].id);

  const needle = search.trim().toLowerCase();
  const filteredEmployees = useMemo(
    () => employees.filter((row) => [row.employee, row.position, row.cycle, row.status].some((value) => value.toLowerCase().includes(needle))),
    [needle],
  );

  function handleAllowanceSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(allowanceAmount);
    if (!allowanceName.trim() || Number.isNaN(amount) || amount <= 0) return;
    setAllowances((current) => [
      ...current,
      { id: crypto.randomUUID(), employeeId: selectedEmployeeId, name: allowanceName.trim(), amount },
    ]);
    setAllowanceName("");
    setAllowanceAmount("");
  }

  const selectedPayslipEmployee = employees.find((employee) => employee.id === payslipEmployeeId) ?? employees[0];
  const selectedAllowances = allowances.filter((item) => item.employeeId === selectedPayslipEmployee.id);
  const allowanceTotal = selectedAllowances.reduce((sum, item) => sum + item.amount, 0);
  const grossPay = selectedPayslipEmployee.baseSalary + allowanceTotal;
  const deductions = Math.round(grossPay * 0.08);
  const netPay = grossPay - deductions;

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-black text-gray-900">{activeSubtab}</h2>
          <p className="mt-1 text-xs font-medium text-gray-500">Manage employee salary details, allowances, and payslip preparation.</p>
        </div>
        <label className="relative block w-full md:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            placeholder="Search payroll records..."
            type="search"
          />
        </label>
      </div>

      {activeSubtab === "Payroll Setup" ? (
        <PayrollTable rows={filteredEmployees} allowances={allowances} />
      ) : null}

      {activeSubtab === "Allowances" ? (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr]">
          <form onSubmit={handleAllowanceSubmit} className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-black text-gray-900">Add Allowance</h3>
            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="px-1 text-[11px] font-bold uppercase tracking-widest text-gray-500">Employee</span>
                <select
                  value={selectedEmployeeId}
                  onChange={(event) => setSelectedEmployeeId(event.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-primary"
                >
                  {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.employee}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="px-1 text-[11px] font-bold uppercase tracking-widest text-gray-500">Allowance Name</span>
                <input
                  value={allowanceName}
                  onChange={(event) => setAllowanceName(event.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-primary"
                  placeholder="Transportation, Meal, Internet"
                />
              </label>
              <label className="block">
                <span className="px-1 text-[11px] font-bold uppercase tracking-widest text-gray-500">Amount</span>
                <input
                  value={allowanceAmount}
                  onChange={(event) => setAllowanceAmount(event.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-primary"
                  placeholder="0.00"
                  type="number"
                />
              </label>
            </div>
            <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/10 transition hover:bg-primary/90" type="submit">
              <Plus className="h-4 w-4" />
              Add Allowance
            </button>
          </form>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-primary text-[11px] font-black uppercase tracking-wider text-white">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Allowance</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allowances.map((allowance) => (
                  <tr key={allowance.id} className="transition hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-gray-900">{employees.find((employee) => employee.id === allowance.employeeId)?.employee}</td>
                    <td className="px-6 py-4 text-gray-600">{allowance.name}</td>
                    <td className="px-6 py-4 text-gray-900">{money(allowance.amount)}</td>
                    <td className="px-6 py-4">
                      <button
                        className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                        onClick={() => setAllowances((current) => current.filter((item) => item.id !== allowance.id))}
                        title="Remove allowance"
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {activeSubtab === "Payslips" ? (
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <PayrollTable rows={filteredEmployees} allowances={allowances} onPreview={setPayslipEmployeeId} />
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="border-b border-gray-200 pb-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Payslip Preview</p>
              <h3 className="mt-2 text-2xl font-black text-gray-900">{selectedPayslipEmployee.employee}</h3>
              <p className="text-sm font-medium text-gray-500">{selectedPayslipEmployee.position} | {selectedPayslipEmployee.cycle}</p>
            </div>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Base Salary</span><span className="font-bold text-gray-900">{money(selectedPayslipEmployee.baseSalary)}</span></div>
              {selectedAllowances.map((allowance) => (
                <div className="flex justify-between" key={allowance.id}>
                  <span className="text-gray-500">{allowance.name}</span>
                  <span className="font-bold text-gray-900">{money(allowance.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-gray-100 pt-3"><span className="text-gray-500">Gross Pay</span><span className="font-bold text-gray-900">{money(grossPay)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Deductions</span><span className="font-bold text-red-500">-{money(deductions)}</span></div>
              <div className="flex justify-between rounded-xl bg-primary/10 px-4 py-3 text-base">
                <span className="font-black text-gray-900">Net Pay</span>
                <span className="font-black text-gray-900">{money(netPay)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
