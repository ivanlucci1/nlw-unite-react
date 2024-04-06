import { ChangeEvent, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, Search } from 'lucide-react';
import { formatDistance } from 'date-fns';

import { Table } from './table/table';
import { TableHeader } from './table/table-header';
import { TableRow } from './table/table-row';
import { TableCell } from './table/table-cell';
import { IconButton } from './icon-button';

import { mockedAttendees, mockedAttendeesTotal } from '../data/attendees';

interface Attendee {
	id: number;
	name: string;
	email: string;
	createdAt: string;
	checkedInAt: string | null;
}

export function AttendeeList() {
	const [search, setSearch] = useState(() => {
		const url = new URL(window.location.toString());

		if (url.searchParams.has('search')) {
			return url.searchParams.get('search') ?? '';
		}

		return '';
	});

	const [page, setPage] = useState(() => {
		const url = new URL(window.location.toString());

		if (url.searchParams.has('page')) {
			return Number(url.searchParams.get('page'));
		}

		return 1;
	});

	const [total, setTotal] = useState(0);
	const [attendees, setAttendees] = useState<Attendee[]>([]);

	const totalPages = Math.ceil(total / attendees.length);

	useEffect(() => {
		const url = new URL('http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees');

		url.searchParams.set('pageIndex', String(page - 1));

		if (search.length > 0) {
			url.searchParams.set('query', search);
		}

		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				setAttendees(data.attendees);
				setTotal(data.total);
			})
			.catch(() => {
				setAttendees(mockedAttendees);
				setTotal(mockedAttendeesTotal);
				console.info('Error fetching from API. Loaded mocked data.');
			});
	}, [page, search]);

	function setCurrentSearch(search: string) {
		const url = new URL(window.location.toString());

		url.searchParams.set('search', search);
		setSearch(search);

		window.history.pushState({}, '', url);
	}

	function setCurrentPage(page: number) {
		const url = new URL(window.location.toString());

		url.searchParams.set('page', String(page));
		setPage(page);

		window.history.pushState({}, '', url);
	}

	function handleSearchInputChanged(event: ChangeEvent<HTMLInputElement>) {
		setCurrentSearch(event.target.value);
		setCurrentPage(1);
	}

	function goToFirstPage() {
		setCurrentPage(1);
	}

	function goToLastPage() {
		setCurrentPage(totalPages);
	}

	function goToNextPage() {
		setCurrentPage(page + 1);
	}

	function goToPreviousPage() {
		setCurrentPage(page - 1);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-3">
				<h1 className="text-2xl font-bold">Participants</h1>

				<div className="px-3 w-72 border border-white/10 bg-transparent rounded-lg text-sm flex items-center gap-3">
					<Search className="size-4 text-emerald-300" />
					<input
						type="search"
						value={search}
						className="bg-transparent flex-1 outline-none py-1.5 border-0 p-0 text-sm focus:ring-0"
						placeholder="Search participants..."
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
					{attendees.map((attendee) => {
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
										<span className="font-semibold text-white">{attendee.name}</span>
										<span>{attendee.email}</span>
									</div>
								</TableCell>
								<TableCell>{formatDistance(attendee.createdAt, new Date(), { addSuffix: true })}</TableCell>
								<TableCell>
									{!attendee.checkedInAt ? (
										<span className="text-zinc-500">Not checked-in</span>
									) : (
										formatDistance(attendee.checkedInAt, new Date(), { addSuffix: true })
									)}
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
							Showing {attendees.length} of {total} items
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
									<IconButton onClick={goToNextPage} disabled={page === totalPages}>
										<ChevronRight className="size-4" />
									</IconButton>
									<IconButton onClick={goToLastPage} disabled={page === totalPages}>
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
