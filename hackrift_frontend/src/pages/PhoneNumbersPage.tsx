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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { AppSidebar } from "@/components/AppSideBar";
import AppLoader from "@/components/AppLoader";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { z } from "zod";

const data: PhoneNumbers[] = [
  {
    phoneNumber: "+65 8939 5160",
    verifiedDate: new Date("2021-09-01"),
    reportCount: 0,
    reverifyDate: new Date("2021-10-01"),
  },
  {
    phoneNumber: "+65 9899 0493",
    verifiedDate: new Date("2021-09-02"),
    reportCount: 1,
    reverifyDate: new Date("2021-09-16"),
  },
  {
    phoneNumber: "+65 8639 8283",
    verifiedDate: new Date("2021-09-03"),
    reportCount: 2,
    reverifyDate: new Date("2021-09-17"),
  },
  {
    phoneNumber: "+65 8304 4898",
    verifiedDate: new Date("2021-09-04"),
    reportCount: 3,
    reverifyDate: new Date("2021-09-18"),
  },
  {
    phoneNumber: "+65 6935 2976",
    verifiedDate: new Date("2021-09-05"),
    reportCount: 4,
    reverifyDate: new Date("2021-09-19"),
  },
];

export type PhoneNumbers = {
  phoneNumber: string;
  verifiedDate: Date;
  reportCount: number;
  reverifyDate: Date;
};

export const columns: ColumnDef<PhoneNumbers>[] = [
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
    accessorKey: "phoneNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone Numbers
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("phoneNumber")}</div>,
  },
  {
    accessorKey: "verifiedDate",
    header: "Verified Date",
    cell: ({ row }) => {
      const date = row.getValue<Date>("verifiedDate");
      return <div>{format(date, "yyyy-MM-dd")}</div>;
    },
  },
  {
    accessorKey: "reportCount",
    header: "Reported Suspicion Count",
    cell: ({ row }) => {
      return <div>{row.getValue("reportCount")}</div>;
    },
  },
  {
    accessorKey: "reverifyDate",
    header: () => <div>Reverify Date</div>,
    cell: ({ row }) => {
      const verifiedDate = row.getValue<Date>("verifiedDate");
      const reverifyDate = row.getValue<Date>("reverifyDate");
      const dateDifference = Math.floor(
        (reverifyDate.getTime() - verifiedDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      return dateDifference > 20 ? (
        <Button
          variant="outline"
        >
          Reverify
        </Button>
      ) : (
        <div>{format(reverifyDate, "yyyy-MM-dd")}</div>
      );
    },
  },
];

function PhoneNumbersPage() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<{
    [key: string]: boolean;
  }>({});
  const [newPhoneNumber, setNewPhoneNumber] = React.useState("");
  const [otp, setOTP] = React.useState("");
  const [phoneNumbers, setPhoneNumbers] = React.useState<PhoneNumbers[]>(data);
  const [isOpen, setIsOpen] = React.useState(false);
  const [otpOpen, setOTPOpen] = React.useState(false);
  const phoneNumberSchema = z.string().regex(/^\+65 \d{4} \d{4}$/);
  const generatedOTP = "863509";

  const handleAddPhoneNumber = () => {
    setOTPOpen(false);
    if (otp !== generatedOTP) return;

    try {
      phoneNumberSchema.parse(newPhoneNumber);

      if (newPhoneNumber.trim() !== "") {
        setPhoneNumbers([
          ...phoneNumbers,
          {
            phoneNumber: newPhoneNumber,
            verifiedDate: new Date(),
            reportCount: 0,
            reverifyDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          },
        ]);
        setNewPhoneNumber("");
        setIsOpen(false);
        
      }
    } catch (error) {
      alert("Invalid phone number format. Use: +65 XXXX XXXX");
    }
  };

  const handleDeleteSelected = () => {
    const selectedRows = Object.keys(rowSelection).filter(
      (key) => rowSelection[key]
    );
    const remainingPhoneNumbers = phoneNumbers.filter(
      (_, index) => !selectedRows.includes(index.toString())
    );
    setPhoneNumbers(remainingPhoneNumbers);
    setRowSelection({}); // Reset selection
  };

  const table = useReactTable({
    data: phoneNumbers,
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
              <div className="flex items-center justify-between py-4">
                <Input
                  placeholder="Filter Phone Numbers..."
                  value={
                    (table
                      .getColumn("phoneNumber")
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn("phoneNumber")
                      ?.setFilterValue(event.target.value)
                  }
                  className="max-w-sm"
                />
                <div className="grid grid-cols-3 gap-5">
                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setIsOpen(true)}>
                        Add Phone Number
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Phone Number</DialogTitle>
                        <DialogDescription>
                          Add a new phone number to the list. (+65 XXXX XXXX)
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="newPhoneNumber" className="text-right">
                          Phone Number
                        </Label>
                        <Input
                          id="newPhoneNumber"
                          className="col-span-3"
                          type="text"
                          value={newPhoneNumber}
                          onChange={(event) =>
                            setNewPhoneNumber(event.target.value)
                          }
                          required
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Dialog open={otpOpen} onOpenChange={setOTPOpen}>
                          <DialogTrigger asChild>
                            <Button onClick={() => setOTPOpen(true)}>
                              Get OTP
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Enter OTP</DialogTitle>
                              <DialogDescription>
                                Enter the OTP sent to the phone number.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-center">
                              <InputOTP
                                maxLength={6}
                                value={otp}
                                onChange={setOTP}
                              >
                                <InputOTPGroup>
                                  <InputOTPSlot index={0} />
                                  <InputOTPSlot index={1} />
                                  <InputOTPSlot index={2} />
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup>
                                  <InputOTPSlot index={3} />
                                  <InputOTPSlot index={4} />
                                  <InputOTPSlot index={5} />
                                </InputOTPGroup>
                              </InputOTP>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setOTPOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleAddPhoneNumber}>
                                Submit
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button onClick={handleDeleteSelected}>
                    Delete Selected Phone Number
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
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
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                          return (
                            <TableHead
                              key={header.id}
                              className="text-center w-[20%]"
                            >
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
                            <TableCell
                              key={cell.id}
                              className="text-center w-[20%]"
                            >
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

export default PhoneNumbersPage;
