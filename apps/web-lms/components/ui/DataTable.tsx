type DataTableProps = {
  columns: string[];
  rows: string[][];
};

export function DataTable({ columns, rows }: DataTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={row.join("-")} className="text-gray-900 transition hover:bg-gray-50">
                {row.map((cell, index) => (
                  <td key={`${cell}-${index}`} className="px-6 py-4 text-sm">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
