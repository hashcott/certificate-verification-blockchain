import Head from "next/head";
import Image from "next/image";
import { BsInfoLg } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import { Container } from "../Container";
import EditProfileForm from "../EditProfileForm";
import { Dispatch, RootState } from "../../store/store";
import { AuthOption, withAuth } from "../../utils/withAuth";
import { useEffect, useState } from "react";
import ListUser from "./user/ListUser";
import CreateUserForm from "./user/CreateUserForm";

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
				<title>Quản lý tài khoản</title>
				<meta name="description" content="Profile page" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Container>
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
											tab === TabUser.CREATE &&
											"tab-active"
										}`}
									>
										Tạo mới
									</a>
								</div>
							</div>
							<div className="w-full">
								{tab === TabUser.LIST && <ListUser />}
							</div>
							<div>
								{tab === TabUser.CREATE && <CreateUserForm />}
							</div>
						</div>
					</>
				) : null}
			</Container>
		</>
	);
};

export default withAuth(AuthOption.REQUIRED, User);
