import React from "react";
import {
  useTable,
  useFilters,
  useSortBy,
  usePagination,
  useBlockLayout,
  useGlobalFilter,
} from "react-table";

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  return (
    <div>
      <input
        value={filterValue || ""}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
        placeholder={`Search ${count} records...`}
      />
    </div>
  );
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return;
  // return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

function TReactTable({ columns, data }) {
  const filterTypes = React.useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const onPageChange = (page) => {
    gotoPage(page - 1);
  };

  function onShowSizeChange(current, pageSize) {
    setPageSize(pageSize);
  }

  function itemRender(current, type, originalElement) {
    if (type === "prev") {
      return <a>Previous</a>;
    }
    if (type === "next") {
      return <a>Next</a>;
    }
    return originalElement;
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    rows,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useBlockLayout,
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    useSortBy,
    usePagination
  );

  return (
    <div className="divide-y">
      {/* <Pagination
        defaultCurrent={1}
        current={pageIndex + 1}
        pageSize={pageSize}
        pageIndex={pageIndex}
        total={rows.length}
        onChange={onPageChange}
      /> */}

      <table
        {...getTableProps()}
        className="min-w-full divide-y divide-gray-200"
      >
        <thead className="bg-gray-50">
          {headerGroups.map((headerGroup, index) => (
            <tr key={index} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => {
                if (column.id === "action") {
                  return (
                    <th
                      // className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      {...column.getHeaderProps()}
                    >
                      {console.log(
                        "column.getHeaderProps()",
                        column.getHeaderProps()
                      )}
                      {column.render("Header")}
                    </th>
                  );
                } else {
                  return (
                    <th
                      // className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      {...column.getHeaderProps()}
                    >
                      {column.render("Header")}
                      <div>
                        {column.canFilter ? column.render("Filter") : null}
                      </div>
                    </th>
                  );
                }
              })}
            </tr>
          ))}
        </thead>
        <tbody
          className="bg-white divide-y divide-gray-200"
          {...getTableBodyProps()}
        >
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <tr
                key={index}
                className="text-gray-900 text-center"
                {...row.getRowProps()}
              >
                {row.cells.map((cell, i) => {
                  return (
                    <td
                      key={i}
                      className="px-6 py-4 whitespace-nowrap"
                      {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TReactTable;
