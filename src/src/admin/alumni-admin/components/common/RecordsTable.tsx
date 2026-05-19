import type { ReactNode } from 'react'

type RecordsTableColumn<T> = {
  header: string
  render: (item: T) => ReactNode
  className?: string
}

type RecordsTableProps<T> = {
  items: T[]
  columns: RecordsTableColumn<T>[]
  getRowKey: (item: T) => string
  emptyMessage: string
  actions?: (item: T) => ReactNode
}

export function RecordsTable<T>({
  items,
  columns,
  getRowKey,
  emptyMessage,
  actions,
}: RecordsTableProps<T>) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="resource-table-wrap">
      <table className="resource-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.header}>{column.header}</th>
            ))}
            {actions ? <th>Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={getRowKey(item)}>
              {columns.map((column) => (
                <td key={column.header} className={column.className ?? ''}>
                  {column.render(item)}
                </td>
              ))}
              {actions ? (
                <td>
                  <div className="row-actions">{actions(item)}</div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
