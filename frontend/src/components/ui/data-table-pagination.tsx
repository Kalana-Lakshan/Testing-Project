import { Button } from "@/components/ui/button";
import type { Table } from "@tanstack/react-table";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
	table: Table<TData>;
}

export function DataTablePagination<TData>({
	table,
}: DataTablePaginationProps<TData>) {
	const rawTotal = table.getPageCount();
	const total = rawTotal >= 0 ? rawTotal : 0;
	const current = total === 0 ? 0 : table.getState().pagination.pageIndex + 1;

	return (
		<div className="flex items-center px-2 mb-4 w-full justify-between">
			<div className="flex items-center space-x-4">

				<div className="flex items-center">
					<p className="text-sm font-medium mr-2">Rows per page</p>
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value) => {
							const newSize = Number(value);
							if (!Number.isNaN(newSize)) {
								table.setPageSize(newSize);
							}
						}}
					>
						<SelectTrigger className="h-8 w-[70px]">
							<SelectValue placeholder={`${table.getState().pagination.pageSize}`} />
						</SelectTrigger>
						<SelectContent side="top">
							{[10, 20, 30, 40, 50].map((pageSize) => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="flex items-center space-x-2">
				<div className="flex items-center">
					<span className="text-sm font-medium">Page {current} of {total}</span>
				</div>
				<Button
					variant="outline"
					size="icon"
					className="hidden size-8 lg:flex"
					onClick={() => {
						if (total > 0) table.setPageIndex(0);
						else table.setPageIndex(0);
					}}
					disabled={!table.getCanPreviousPage()}
				>
					<span className="sr-only">Go to first page</span>
					<ChevronsLeft />
				</Button>

				<Button
					variant="outline"
					size="icon"
					className="size-8"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					<span className="sr-only">Go to previous page</span>
					<ChevronLeft />
				</Button>

				<Button
					variant="outline"
					size="icon"
					className="size-8"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					<span className="sr-only">Go to next page</span>
					<ChevronRight />
				</Button>

				<Button
					variant="outline"
					size="icon"
					className="hidden size-8 lg:flex"
					onClick={() => {
						if (total > 0) table.setPageIndex(total - 1);
						else table.setPageIndex(0);
					}}
					disabled={!table.getCanNextPage()}
				>
					<span className="sr-only">Go to last page</span>
					<ChevronsRight />
				</Button>
			</div>
		</div>
	);
}
