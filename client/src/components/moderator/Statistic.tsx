import Head from "next/head";
import Image from "next/image";
import { BsInfoLg } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import { RootState } from "../../store/store";
import { AuthOption, withAuth } from "../../utils/withAuth";
import { CertificationStatus } from "../../utils/types";

interface StatisticProps {}

const Statistic: React.FC<StatisticProps> = ({}) => {
	let userState = useSelector((state: RootState) => state.user);
	const { user, authenticated, student, manager } = userState;
	const router = useRouter();

	return (
		<>
			<Head>
				<title>Thống kê</title>
				<meta name="description" content="Profile page" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{authenticated && user !== null ? (
				<>
					<div className="p-3 rounded-lg shadow-sm bg-base-300">
						<div className="flex items-center space-x-2 font-semibold leading-8">
							<span className="text-lg">
								<BsInfoLg />
							</span>
							<span className="mx-5">Thống kê</span>
						</div>
						<div>
							<div className="grid text-sm md:grid-cols-2">
								<div className="grid grid-cols-2">
									<div className="px-4 py-2 font-semibold">
										Tổng số bằng câp
									</div>
									<div className="px-4 py-2">
										{student.length}
									</div>
								</div>
								<div className="grid grid-cols-2">
									<div className="px-4 py-2 font-semibold">
										Tổng số người quản lý
									</div>
									<div className="px-4 py-2">
										{manager.length}
									</div>
								</div>
								<div className="grid grid-cols-2">
									<div className="px-4 py-2 font-semibold">
										Bằng cấp đã được xác thực
									</div>
									<div className="px-4 py-2">
										{
											student.filter(
												(user) =>
													user.certification
														.certificationStatus ===
													CertificationStatus.VERIFIED
											).length
										}
									</div>
								</div>
								<div className="grid grid-cols-2">
									<div className="px-4 py-2 font-semibold">
										Bằng cấp đang chờ xác thực
									</div>
									<div className="px-4 py-2">
										{
											student.filter(
												(user) =>
													user.certification
														.certificationStatus ===
													CertificationStatus.PENDING
											).length
										}
									</div>
								</div>
								<div className="grid grid-cols-2">
									<div className="px-4 py-2 font-semibold">
										Bằng cấp đã bị khóa
									</div>
									<div className="px-4 py-2">
										{
											student.filter(
												(user) =>
													user.certification
														.certificationStatus ===
													CertificationStatus.BANNED
											).length
										}
									</div>
								</div>
							</div>
						</div>
					</div>
				</>
			) : null}
		</>
	);
};

export default withAuth(AuthOption.REQUIRED, Statistic);
