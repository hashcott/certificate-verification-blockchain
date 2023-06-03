import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";

import { useEffect, useMemo, useState } from "react";
import { Dispatch, RootState } from "../../../store/store";
import { AuthOption, withAuth } from "../../../utils/withAuth";
import { certColumnDefs } from "./table/CertColumnDefs";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
	Column,
	ColumnFiltersState,
	FilterFn,
	SortingState,
	Table,
	flexRender,
	getCoreRowModel,
	getFacetedMinMaxValues,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import Pagination from "./table/Pagination";
import {
	RankingInfo,
	rankItem,
	compareItems,
} from "@tanstack/match-sorter-utils";
import { CertificationStatus } from "../../../utils/types";

interface CertificationProps {}
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
	// Rank the item
	const itemRank = rankItem(row.getValue(columnId), value);

	// Store the itemRank info
	addMeta({
		itemRank,
	});

	// Return if the item should be filtered in/out
	return itemRank.passed;
};

const Certification: React.FC<CertificationProps> = ({}) => {
	const dispatch = useDispatch<Dispatch>();

	let userState = useSelector((state: RootState) => state.user);
	const { user, authenticated, student } = userState;

	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [globalFilter, setGlobalFilter] = useState("");
	const table = useReactTable({
		columns: certColumnDefs,
		data: student,
		state: {
			sorting,
			columnFilters,
			globalFilter,
		},
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: fuzzyFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getFacetedMinMaxValues: getFacetedMinMaxValues(),
		onSortingChange: setSorting,
	});
	useEffect(() => {
		dispatch.user.listStudentWithCert();
	}, []);
	const headers = table.getHeaderGroups();
	const rows = table.getRowModel().rows;

	const handleConfirm = (providerId: string, action: boolean) => {
		confirmAlert({
			title: `Bạn đang xác nhận đủ điều kiện tốt nghiệp cho sinh viên với mã sinh viên ${providerId}.`,
			message: `Ấn "Đồng ý" nếu bạn xác nhận sinh viên trên đủ điều kiện tốt nghiệp. Bạn sẽ chịu hoàn toàn trách nhiệm trước pháp luật với hành động này !"`,
			buttons: [
				{
					label: "Đồng ý",
					onClick: () => {
						if (action) {
							console.log("hello");

							dispatch.user.unconfirm({ providerId });
							return;
						}
						dispatch.user.confirm({ providerId });
					},
				},
				{
					label: "Không đồng ý",
					onClick: () => {},
				},
			],
		});
	};
	const renderTable = () => {
		if (student.length > 0) {
			return (
				<>
					<thead>
						{headers.map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									if (
										header
											.getContext()
											.column.id.includes("isVerifiedBy")
									) {
										if (
											user?.position &&
											!header
												.getContext()
												.column.id.includes(
													user?.position
												)
										) {
											return;
										}
									}

									return (
										<th
											key={header.id}
											colSpan={header.colSpan}
										>
											{header.isPlaceholder ? null : (
												<>
													<div
														{...{
															className:
																header.column.getCanSort()
																	? "cursor-pointer select-none text-center"
																	: "",
															onClick:
																header.column.getToggleSortingHandler(),
														}}
													>
														{flexRender(
															header.column
																.columnDef
																.header,
															header.getContext()
														)}
														{{
															asc: " 🔼",
															desc: " 🔽",
														}[
															header.column.getIsSorted() as string
														] ?? null}
													</div>
													{header.column.getCanFilter() ? (
														<div>
															<Filter
																column={
																	header.column
																}
																table={table}
															/>
														</div>
													) : null}
												</>
											)}
										</th>
									);
								})}
							</tr>
						))}
					</thead>
					<tbody>
						{rows.map((row) => (
							<tr key={row.id}>
								{row.getVisibleCells().map((cell) => {
									if (
										cell
											.getContext()
											.column.id.includes("isVerifiedBy")
									) {
										if (
											user?.position &&
											!cell
												.getContext()
												.column.id.includes(
													user?.position
												)
										) {
											return;
										}
									}
									if (
										cell
											.getContext()
											.column.id.includes("action")
									) {
										if (
											row.getValue(
												"certificationStatus"
											) === CertificationStatus.VERIFIED
										) {
											return (
												<button className="btn btn-danger">
													Blockchain Verified
												</button>
											);
										}
										if (
											row.getValue(
												"certificationStatus"
											) === CertificationStatus.BANNED
										) {
											return (
												<button className="btn btn-danger">
													Đã bị hủy bỏ
												</button>
											);
										}
										return (
											<td key={cell.id}>
												<button
													className={`btn btn-${
														row.getValue(
															`isVerifiedBy${user?.position}`
														) === true
															? "danger"
															: "success"
													}`}
													onClick={() =>
														handleConfirm(
															row.getValue(
																"providerId"
															),
															row.getValue(
																`isVerifiedBy${user?.position}`
															)
														)
													}
												>
													{row.getValue(
														`isVerifiedBy${user?.position}`
													) === true
														? "Hủy xác thực"
														: "Xác thực"}
												</button>
											</td>
										);
									}
									return (
										<td key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</>
			);
		}
	};
	return (
		<>
			<Head>
				<title>Danh sách chứng chỉ</title>
				<meta name="description" content="Profile page" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="pt-10 w-full overflow-x-auto">
				<input
					value={globalFilter ?? ""}
					onChange={(e) => setGlobalFilter(e.target.value)}
					className="p-2 font-lg shadow border border-block"
					placeholder="Tìm kiếm tất cả..."
				/>
				<table className="table">{renderTable()}</table>
				{student.length && <Pagination table={table} />}
			</div>
		</>
	);
};

export default withAuth(AuthOption.REQUIRED, Certification);

function Filter({
	column,
	table,
}: {
	column: Column<any, unknown>;
	table: Table<any>;
}) {
	const firstValue = table
		.getPreFilteredRowModel()
		.flatRows[0]?.getValue(column.id);

	const columnFilterValue = column.getFilterValue();

	const sortedUniqueValues = useMemo(
		() =>
			typeof firstValue === "number"
				? []
				: Array.from(column.getFacetedUniqueValues().keys()).sort(),
		[column.getFacetedUniqueValues()]
	);

	return typeof firstValue === "number" ? (
		<div>
			<div className="flex space-x-2">
				<DebouncedInput
					type="number"
					min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
					max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
					value={(columnFilterValue as [number, number])?.[0] ?? ""}
					onChange={(value) =>
						column.setFilterValue((old: [number, number]) => [
							value,
							old?.[1],
						])
					}
					placeholder={`Min ${
						column.getFacetedMinMaxValues()?.[0]
							? `(${column.getFacetedMinMaxValues()?.[0]})`
							: ""
					}`}
					className="w-24 border shadow rounded"
				/>
				<DebouncedInput
					type="number"
					min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
					max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
					value={(columnFilterValue as [number, number])?.[1] ?? ""}
					onChange={(value) =>
						column.setFilterValue((old: [number, number]) => [
							old?.[0],
							value,
						])
					}
					placeholder={`Max ${
						column.getFacetedMinMaxValues()?.[1]
							? `(${column.getFacetedMinMaxValues()?.[1]})`
							: ""
					}`}
					className="w-24 border shadow rounded"
				/>
			</div>
			<div className="h-1" />
		</div>
	) : (
		<>
			<datalist id={column.id + "list"}>
				{sortedUniqueValues.slice(0, 5000).map((value: any) => (
					<option value={value} key={value} />
				))}
			</datalist>
			<DebouncedInput
				type="text"
				value={(columnFilterValue ?? "") as string}
				onChange={(value) => {
					if (value === "true") {
						column.setFilterValue(true);
						return;
					}
					if (value === "false") {
						column.setFilterValue(false);
						return;
					}
					column.setFilterValue(value);
				}}
				placeholder={`Tìm... (${column.getFacetedUniqueValues().size})`}
				className="input input-bordered w-full text-xs"
				list={column.id + "list"}
			/>
			<div className="h-1" />
		</>
	);
}

// A debounced input react component
function DebouncedInput({
	value: initialValue,
	onChange,
	debounce = 500,
	...props
}: {
	value: string | number;
	onChange: (value: string | number) => void;
	debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
	const [value, setValue] = useState(initialValue);

	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(value);
		}, debounce);

		return () => clearTimeout(timeout);
	}, [value]);

	return (
		<input
			{...props}
			value={value}
			onChange={(e) => setValue(e.target.value)}
		/>
	);
}
