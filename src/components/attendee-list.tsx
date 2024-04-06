import { ChangeEvent, useState } from "react";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	MoreHorizontal,
	Search,
} from "lucide-react";
import { formatDistance } from "date-fns";

import { Table } from "./table/table";
import { TableHeader } from "./table/table-header";
import { TableRow } from "./table/table-row";
import { TableCell } from "./table/table-cell";
import { IconButton } from "./icon-button";
import { attendees } from "../data/attendees";

export function AttendeeList() {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);

	const pageSize = 10;
	const totalPages = Math.ceil(attendees.length / pageSize);

	function handleSearchInputChanged(event: ChangeEvent<HTMLInputElement>) {
		setSearch(event.target.value);
	}

	function goToFirstPage() {
		setPage(1);
	}

	function goToNextPage() {
		setPage(page + 1);
	}

	function goToPreviousPage() {
		setPage(page - 1);
	}

	function goToLastPage() {
		setPage(totalPages);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-3">
				<h1 className="text-2xl font-bold">Participants</h1>

				<div className="px-3 w-72 border border-white/10 bg-transparent rounded-lg text-sm flex items-center gap-3">
					<Search className="size-4 text-emerald-300" />
					<input
						className="bg-transparent flex-1 outline-none py-1.5 border-0 p-0 text-sm"
						type="search"
						placeholder="Search participants..."
						value={search}
						onChange={handleSearchInputChanged}
					/>
				</div>
			</div>

			<Table>
				<thead>
					<tr className="border-b border-white/10">
						<TableHeader style={{ width: 48 }}>
							<input
								className="size-4 bg-black/20 rounded border border-white/10 accent-orange-400"
								type="checkbox"
							/>
						</TableHeader>
						<TableHeader>Code</TableHeader>
						<TableHeader>Participant name</TableHeader>
						<TableHeader>Subscription date</TableHeader>
						<TableHeader>Check-in date</TableHeader>
						<TableHeader style={{ width: 64 }}></TableHeader>
					</tr>
				</thead>
				<tbody>
					{attendees
						.slice((page - 1) * pageSize, page * pageSize)
						.map((attendee) => {
							return (
								<TableRow key={attendee.id}>
									<TableCell>
										<input
											className="size-4 bg-black/20 rounded border border-white/10 accent-orange-400"
											type="checkbox"
										/>
									</TableCell>
									<TableCell>{attendee.id}</TableCell>
									<TableCell>
										<div className="flex flex-col gap-1">
											<span className="font-semibold text-white">
												{attendee.name}
											</span>
											<span>{attendee.email}</span>
										</div>
									</TableCell>
									<TableCell>
										{formatDistance(attendee.createdAt, new Date(), {
											addSuffix: true,
										})}
									</TableCell>
									<TableCell>
										{formatDistance(attendee.checkedInAt, new Date(), {
											addSuffix: true,
										})}
									</TableCell>
									<TableCell>
										<IconButton transparent>
											<MoreHorizontal className="size-4" />
										</IconButton>
									</TableCell>
								</TableRow>
							);
						})}
				</tbody>
				<tfoot>
					<tr>
						<TableCell colSpan={3}>
							Showing {pageSize} of {attendees.length} items
						</TableCell>
						<TableCell className="text-right" colSpan={3}>
							<div className="inline-flex items-center gap-8">
								<span>
									Page {page} of {totalPages}
								</span>

								<div className="flex gap-1.5">
									<IconButton onClick={goToFirstPage} disabled={page === 1}>
										<ChevronsLeft className="size-4" />
									</IconButton>
									<IconButton onClick={goToPreviousPage} disabled={page === 1}>
										<ChevronLeft className="size-4" />
									</IconButton>
									<IconButton
										onClick={goToNextPage}
										disabled={page === totalPages}
									>
										<ChevronRight className="size-4" />
									</IconButton>
									<IconButton
										onClick={goToLastPage}
										disabled={page === totalPages}
									>
										<ChevronsRight className="size-4" />
									</IconButton>
								</div>
							</div>
						</TableCell>
					</tr>
				</tfoot>
			</Table>
		</div>
	);
}
