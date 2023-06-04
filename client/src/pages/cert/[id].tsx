import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import { Container } from "../../components/Container";
import { Dispatch, RootState } from "../../store/store";
import { useEffect } from "react";
import { DegreeClassfication } from "../../utils/types";
import { AiOutlineQrcode } from "react-icons/ai";
import QRCode from "react-qr-code";

interface MeProps {}

const Me: React.FC<MeProps> = ({}) => {
	const dispatch = useDispatch<Dispatch>();

	let userState = useSelector((state: RootState) => state.user);
	const { currentCert } = userState;
	const router = useRouter();
	useEffect(() => {
		dispatch.user.getCert({ providerId: router.query.id });
	}, []);
	console.log("=======================", process.env);

	return (
		<>
			<Head>
				<title>Profile</title>
				<meta name="description" content="Profile page" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Container>
				{currentCert != null && (
					<div className="relative mt-10 p-8 bg-gradient-to-r from-red-900 to-red-800 rounded-lg shadow-md">
						<span className="absolute">
							<label htmlFor="edit-modal">
								<AiOutlineQrcode size={42} />
							</label>
						</span>
						<div className="text-center text-white mb-12">
							<h2 className="text-2xl font-bold">
								CỘNG HÒA XÃ HỘI CHỦ NGHĨA ...
								<br />
								Độc lập - Tự do - Hạnh phúc
							</h2>
							<h3 className="mt-5 text-xl font-bold">
								Bộ giáo dục và đào tạo ...
								<br />
								Trường đại học ...
							</h3>
							<p className="font-medium">cấp</p>
							<h3 className="mt-5 text-xl font-bold">
								BẰNG KỸ SƯ
							</h3>
						</div>
						<div className="pl-52 text-left text-white mb-12">
							<h2 className="text-2xl font-semibold mt-2 mb-8">
								{currentCert.firstName} {currentCert.lastName}
							</h2>
							<p className="font-medium">Hạng tốt nghiệp:</p>
							<h3 className="text-xl font-semibold mt-2 mb-4">
								{currentCert.certification
									.degreeClassfication ===
									DegreeClassfication.GOOD && "Giỏi"}
							</h3>
							<p className="font-medium">Ngày cấp:</p>
							<p className="text-lg mb-12">
								{
									new Date(currentCert.createdAt)
										.toLocaleString()
										.split(",")[0]
								}
							</p>
						</div>
						<div className="flex justify-between items-center text-white">
							<div className="w-1/2">
								<hr className="border-t-2 border-white w-3/4 mb-0 mx-auto" />
								<p className="text-center mt-4 font-medium">
									Số hiệu: {currentCert.id}
								</p>
							</div>
							<div className="w-1/2">
								<hr className="border-t-2 border-white w-3/4 mb-0 mx-auto" />
								<p className="text-center mt-4 font-medium">
									Hiệu trưởng ký
								</p>
							</div>
						</div>
					</div>
				)}
			</Container>
			<input type="checkbox" id="edit-modal" className="modal-toggle" />
			<div className="modal">
				<div className="modal-box">
					<label
						htmlFor="edit-modal"
						className="absolute btn btn-sm btn-circle right-2 top-2"
					>
						✕
					</label>
					<QRCode
						size={256}
						style={{
							height: "auto",
							maxWidth: "100%",
							width: "100%",
						}}
						value={`${process.env.NEXT_PUBLIC_DOMAIN}/cert/${router.query.id}`}
						viewBox={`0 0 256 256`}
					/>
				</div>
			</div>
		</>
	);
};

export default Me;
