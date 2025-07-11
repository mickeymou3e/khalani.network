"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Proof } from "../page";

type Instances = Array<string>;

const DELETE_PROOF = `mutation deleteProof($proofId: String!, $organizationName: String!) {
  deleteProof(proofId: $proofId, organizationName: $organizationName)
}`;

const getColumns: (orgName: string) => ColumnDef<Proof>[] = (
  orgName: string,
) => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="lowercase">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="pl-4 capitalize">
        {row.getValue("status") === "SUCCESS" ? (
          <div className="ml-4 h-4 w-4 rounded-[100%] border-[1px] border-green-300 bg-green-400" />
        ) : row.getValue("status") === "PENDING" ? (
          <div className="ml-4 h-4 w-4 rounded-[100%] border-[1px] border-orange-300 bg-orange-400" />
        ) : row.getValue("status") === "FAILED" ? (
          <div className="ml-4 h-4 w-4 rounded-[100%] border-[1px] border-red-300 bg-red-400" />
        ) : (
          <div className="ml-4 h-4 w-4 rounded-[100%] bg-gray-400" />
        )}
      </div>
    ),
  },
  {
    accessorKey: "timeTaken",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="ml-7 lg:ml-8">{row.getValue("timeTaken")} s</div>
    ),
  },
  {
    accessorKey: "proof",
    header: ({ column }) => {
      return null;
    },
    cell: ({ row }) => {
      const payload = {
        proof: row.original.proof,
        instances: row.original.instances,
      };

      return (
        <Button
          onMouseDown={() => {
            navigator.clipboard.writeText(JSON.stringify(payload));
          }}
          className="drop-shadow-lg active:bg-slate-300"
          style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
        >
          Copy
        </Button>
      );
    },
  },
  {
    accessorKey: "delete",
    header: ({ column }) => {
      return null;
    },
    cell: ({ row }) => {
      return (
        <Button
          // variant="ghost
          className="bg-red-500"
          onClick={async () => {
            const resp = await fetch("https://hub-staging.ezkl.xyz/graphql", {
              cache: "no-store",
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                query: DELETE_PROOF,
                variables: {
                  proofId: row.original.id,
                  organizationName: orgName,
                },
              }),
            });
          }}
        >
          Delete
        </Button>
      );
    },
  },
];

export default function ProofTable({
  proofs,
  organizationName,
}: {
  proofs: Proof[];
  organizationName: string;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns: ColumnDef<Proof>[] = getColumns(organizationName);

  const table = useReactTable({
    // data,
    data: proofs,
    columns: columns as ColumnDef<unknown, any>[],
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  function debounce<T extends Function>(func: T, wait: number): T {
    let timeout: NodeJS.Timeout;
    return ((...args: any[]) => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        func(...args);
      }, wait);
    }) as unknown as T;
  }

  // const filterUserColumn = React.useCallback(() => {
  //   if (window.innerWidth < 768) {
  //     table.getColumn("user")?.toggleVisibility(false);
  //   } else {
  //     table.getColumn("user")?.toggleVisibility(true);
  //   }
  // }, [table]);

  // const debouncedFilterUserColumn = React.useMemo(
  //   () => debounce(filterUserColumn, 100),
  //   [filterUserColumn],
  // );

  // React.useEffect(() => {
  //   debouncedFilterUserColumn();
  //   window.addEventListener("resize", debouncedFilterUserColumn);

  //   return () =>
  //     window.removeEventListener("resize", debouncedFilterUserColumn);
  // }, [debouncedFilterUserColumn]);

  return (
    <div className="w-full">
      <div className="flex items-center pb-10">
        <Input
          placeholder="Filter proofs..."
          value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("id")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto text-black">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="hover:bg-[#111111]" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="hover:bg-slate-500 data-[state=selected]:bg-slate-700"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {rowSelection && Object.keys(rowSelection).length > 0 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="space-x-2">
            <Button
              variant="outline"
              size="lg"
              className="bg-white text-black"
              onClick={() => table.nextPage()}
              // disabled={!table.getCanNextPage()}
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
