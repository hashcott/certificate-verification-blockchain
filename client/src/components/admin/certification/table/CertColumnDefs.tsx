//./components/UserColumnDefs.tsx
import { createColumnHelper } from "@tanstack/react-table";
import { Certification, User } from "../../../../utils/types";

// createColumnHelper helps us create columns with maximum type safety.
// we assign the type person so that it knows the structure for our data
const columnHelper = createColumnHelper<Certification>();

export const certColumnDefs = [
	columnHelper.accessor((row) => row.studentCode, {
		id: "studentCode",
		cell: (info) => info.getValue(),
		header: () => <span>Mã sinh viên</span>,
		enableHiding: true,
	}),
	columnHelper.accessor((row) => row.firstName, {
		id: "firstName",
		cell: (info) => <span>{info.getValue()}</span>,
		header: () => <span>Họ và đệm</span>,
	}),
	columnHelper.accessor((row) => row.lastName, {
		id: "lastName",
		cell: (info) => <span>{info.getValue()}</span>,
		header: () => <span>Tên</span>,
	}),
	columnHelper.accessor((row) => row.certificationStatus, {
		id: "certificationStatus",
		cell: (info) => <span>{info.getValue()}</span>,
		header: () => <span>Trạng thái chứng chỉ</span>,
	}),
	{
		header: "Được xác thực bởi",
		columns: [
			columnHelper.accessor((row) => row.isVerifiedByDAOTAO, {
				id: "isVerifiedByDAOTAO",
				cell: (info) => <span>{info.getValue().toString()}</span>,
				header: () => <span>Đào tạo</span>,
			}),
			columnHelper.accessor((row) => row.isVerifiedByTAIVU, {
				id: "isVerifiedByTAIVU",
				cell: (info) => <span>{info.getValue().toString()}</span>,
				header: () => <span>Tài vụ</span>,
			}),
			columnHelper.accessor((row) => row.isVerifiedByKHOA, {
				id: "isVerifiedByKHOA",
				cell: (info) => <span>{info.getValue().toString()}</span>,
				header: () => <span>Khoa</span>,
			}),
			columnHelper.accessor((row) => row.isVerifiedByKTX, {
				id: "isVerifiedByKTX",
				cell: (info) => <span>{info.getValue().toString()}</span>,
				header: () => <span>KTX</span>,
			}),
			columnHelper.accessor((row) => row.isVerifiedByTHUVIEN, {
				id: "isVerifiedByTHUVIEN",
				cell: (info) => <span>{info.getValue().toString()}</span>,
				header: () => <span>Thư viện</span>,
			}),
			columnHelper.accessor((row) => row.isVerifiedByHT, {
				id: "isVerifiedByHT",
				cell: (info) => <span>{info.getValue().toString()}</span>,
				header: () => <span>Hiệu trưởng</span>,
			}),
		],
	},
];
