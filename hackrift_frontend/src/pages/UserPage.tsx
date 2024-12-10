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
import { ArrowUpDown, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import { AppSidebar } from "@/components/AppSideBar";
import AppLoader from "@/components/AppLoader";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { format } from "date-fns";

const data: CompanyDetails[] = [
  {
    registeredNumber: "+65 8939 5160",
    dateVerified: new Date("2021-09-01"),
    daysToReverify:
      new Date("2021-09-15").getDate() - new Date("2021-09-01").getDate(),
    reportCount: 0,
  },
  {
    registeredNumber: "+65 9899 0493",
    dateVerified: new Date("2021-09-02"),
    daysToReverify:
      new Date("2021-09-16").getDate() - new Date("2021-09-02").getDate(),
    reportCount: 1,
  },
  {
    registeredNumber: "+65 8639 8283",
    dateVerified: new Date("2021-09-03"),
    daysToReverify:
      new Date("2021-09-17").getDate() - new Date("2021-09-03").getDate(),
    reportCount: 2,
  },
  {
    registeredNumber: "+65 8304 4898",
    dateVerified: new Date("2021-09-04"),
    daysToReverify:
      new Date("2021-09-18").getDate() - new Date("2021-09-04").getDate(),
    reportCount: 3,
  },
  {
    registeredNumber: "+65 6935 2976",
    dateVerified: new Date("2021-09-05"),
    daysToReverify:
      new Date("2021-09-19").getDate() - new Date("2021-09-05").getDate(),
    reportCount: 4,
  },
  {
    registeredNumber: "+65 9746 8655",
    dateVerified: new Date(),
    daysToReverify: 30,
    reportCount: 0,
  },
];

export type CompanyDetails = {
  registeredNumber: string;
  dateVerified: Date;
  daysToReverify: number;
  reportCount: number;
};

export const columns: ColumnDef<CompanyDetails>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "registeredNumber",
    header: "Registered Number",
    cell: ({ row }) => <div>{row.getValue("registeredNumber")}</div>,
  },
  {
    accessorKey: "dateVerified",
    header: "Date Verified",
    cell: ({ row }) => (
      <div>{format(row.getValue("dateVerified"), "yyyy-MM-dd")}</div>
    ),
  },
  {
    accessorKey: "daysToReverify",
    header: "Days to Reverify",
    cell: ({ row }) => <div>{row.getValue("daysToReverify")}</div>,
  },
  {
    accessorKey: "reportCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Number of Suspicion Report
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("reportCount")}</div>,
  },
];

function UserPage() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
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

  return (
    <AppLoader>
      <SidebarProvider>
        <div className="flex w-screen h-screen">
          <AppSidebar />
          <div className="flex-1">
            <SidebarTrigger className="m-5 w-10 h-10 bg-black text-white" />
            <main className="p-6 w-full">
              <div className="flex items-center py-4">
                <Input
                  placeholder="Filter Registered Number..."
                  value={
                    (table
                      .getColumn("registeredNumber")
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn("registeredNumber")
                      ?.setFilterValue(event.target.value)
                  }
                  className="max-w-sm"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                      Filter Columns <ChevronDown />
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
                </DropdownMenu>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                          return (
                            <TableHead key={header.id} className="text-center w-[20%]">
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
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
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="text-center w-[20%]">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
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
              <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                  {table.getFilteredSelectedRowModel().rows.length} of{" "}
                  {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AppLoader>
  );
}

export default UserPage;
