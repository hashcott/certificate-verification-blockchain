import Head from "next/head";
import Image from "next/image";
import { BsInfoLg } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";

import { Dispatch, RootState } from "../../store/store";
import { AuthOption, withAuth } from "../../utils/withAuth";
import { useEffect, useState } from "react";

import ListCertification from "./certification/ListCertification";
import CreateCertForm from "./certification/CreateCertForm";

interface UserProps {}
enum TabUser {
	LIST = "list",
	CREATE = "create",
}

const User: React.FC<UserProps> = ({}) => {
	const dispatch = useDispatch<Dispatch>();

	let userState = useSelector((state: RootState) => state.user);
	const { user, authenticated } = userState;

	const [tab, setTab] = useState(TabUser.LIST);

	useEffect(() => {
		dispatch.user.listManager();
	}, []);
	return (
		<>
			<Head>
				<title>Quản lý chứng chỉ</title>
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
							<div className="tabs">
								<a
									onClick={() => setTab(TabUser.LIST)}
									className={`tab tab-lifted ${
										tab === TabUser.LIST && "tab-active"
									}`}
								>
									Danh sách
								</a>
								<a
									onClick={() => setTab(TabUser.CREATE)}
									className={`tab tab-lifted ${
										tab === TabUser.CREATE && "tab-active"
									}`}
								>
									Tạo chứng chỉ
								</a>
							</div>
						</div>
						<div>
							{tab === TabUser.LIST && <ListCertification />}
						</div>
						<div>
							{tab === TabUser.CREATE && <CreateCertForm />}
						</div>
					</div>
					<div className="my-4" />
				</>
			) : null}
		</>
	);
};

export default withAuth(AuthOption.REQUIRED, User);
