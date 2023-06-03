import Head from "next/head";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import { Container } from "../../components/Container";
import { RootState } from "../../store/store";
import { AuthOption, withAuth } from "../../utils/withAuth";
import { useState } from "react";
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import Statistic from "../../components/moderator/Statistic";
import Certification from "../../components/moderator/Certification";

interface MeProps {}

enum Screen {
	CERTIFICATION = "certification",
	STATISTIC = "statistic",
}

const Me: React.FC<MeProps> = ({}) => {
	let userState = useSelector((state: RootState) => state.user);
	const { user, authenticated } = userState;
	const router = useRouter();
	const [screen, setScreen] = useState(Screen.CERTIFICATION);

	return (
		<>
			<Head>
				<title>Trang quản lý</title>
				<meta name="description" content="Profile page" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Container>
				{authenticated && user !== null ? (
					<div className="w-full py-5 mx-auto my-5">
						<div className="md:flex no-wrap md:-mx-2">
							<div className="w-full md:w-2/12 md:mx-2">
								<ul className="menu bg-base-200 w-56 rounded-box">
									<li
										className={`${
											screen === Screen.STATISTIC &&
											"active"
										}`}
										onClick={() =>
											setScreen(Screen.STATISTIC)
										}
									>
										<a>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
												/>
											</svg>
											Thống kê
										</a>
									</li>
									<li
										className={`${
											screen === Screen.CERTIFICATION &&
											"active"
										}`}
										onClick={() =>
											setScreen(Screen.CERTIFICATION)
										}
									>
										<a>
											<AiOutlineSafetyCertificate />
											Chứng chỉ
										</a>
									</li>
								</ul>
							</div>
							<div className="w-full lg:mx-2 md:w-10/12">
								{screen === Screen.STATISTIC && <Statistic />}
								{screen === Screen.CERTIFICATION && (
									<Certification />
								)}

								<div className="my-4" />
							</div>
						</div>
					</div>
				) : null}
			</Container>
		</>
	);
};

export default withAuth(AuthOption.REQUIRED, Me);
