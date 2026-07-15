import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import '../stylesheets/AdminDataTable.css';

function DataTable({
  columns,
  data,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No records found.',
  pageSize = 8,
  exportFilename = 'export.csv',
  toolbarExtra = null,
}) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data: Array.isArray(data) ? data : [],
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const handleExportCsv = () => {
    const rows = table.getFilteredRowModel().rows;
    const header = columns.filter(c => c.header && c.id !== 'actions').map(c => `"${c.header}"`).join(',');
    
    const body = rows.map(r =>
      columns.filter(c => c.header && c.id !== 'actions')
        // FIX: Always query by c.id as TanStack keys everything under the column's resolved ID
        .map(c => `"${String(r.getValue(c.id) ?? '').replace(/"/g, '""')}"`)
        .join(',')
    );
    
    const csv = [header, ...body].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; 
    link.download = exportFilename; 
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="datatable-wrapper">
      <div className="datatable-toolbar">
        <input
          className="datatable-search"
          placeholder={searchPlaceholder}
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
        <div className="datatable-toolbar-right">
          {toolbarExtra}
          <button type="button" className="datatable-export-btn" onClick={handleExportCsv}>
            Export CSV
          </button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className={h.column.getCanSort() ? 'sortable-th' : ''}
                    onClick={h.column.getToggleSortingHandler()}
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {{ asc: ' ▲', desc: ' ▼' }[h.column.getIsSorted()] ?? ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="datatable-empty">
                  {emptyMessage}
                </td>
              </tr>
            )}
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={columns.length}>
                <div className="table-footer">
                  <div className="footer-status">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
                    {' '}— {table.getFilteredRowModel().rows.length} total
                  </div>
                  <ul className="pagination">
                    <li>
                      <a 
                        href="#" 
                        onClick={(e) => { 
                          e.preventDefault(); 
                          if (table.getCanPreviousPage()) table.previousPage(); 
                        }}
                      >
                        &#8592;
                      </a>
                    </li>
                    <li>
                      <a 
                        href="#" 
                        onClick={(e) => { 
                          e.preventDefault(); 
                          if (table.getCanNextPage()) table.nextPage(); 
                        }}
                      >
                        &#8594;
                      </a>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default DataTable;