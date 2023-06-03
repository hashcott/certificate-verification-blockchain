import Head from "next/head";
import Image from "next/image";
import { BsInfoLg } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import { useEffect } from "react";
import { Dispatch, RootState } from "../../../store/store";
import { Container } from "../../Container";
import { AuthOption, withAuth } from "../../../utils/withAuth";

interface UserProps {}

const User: React.FC<UserProps> = ({}) => {
	const dispatch = useDispatch<Dispatch>();

	let userState = useSelector((state: RootState) => state.user);
	const { user, authenticated, manager } = userState;
	console.log(manager);

	useEffect(() => {
		dispatch.user.listManager();
	}, []);

	const renderUser = () => {
		if (manager.length === 0) return;
		return manager.map(
			({ firstName, lastName, email, role, position, id }) => {
				return (
					<tr key={id}>
						<td>
							<div className="flex items-center space-x-3">
								<div>
									<div className="font-bold">{`${firstName} ${lastName}`}</div>
								</div>
							</div>
						</td>
						<td>{email}</td>
						<td>{role}</td>
						<td>{position}</td>
						<th>
							<button className="btn btn-error btn-xs">
								Remove
							</button>
						</th>
					</tr>
				);
			}
		);
	};

	return (
		<>
			<Head>
				<title>Danh sách tài khoản</title>
				<meta name="description" content="Profile page" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="overflow-x-auto">
				<table className="table w-full">
					{/* head */}
					<thead>
						<tr>
							<th>Họ và tên</th>
							<th>Email</th>
							<th>Quyền</th>
							<th>Vị trí</th>
							<th></th>
						</tr>
					</thead>
					<tbody>{renderUser()}</tbody>
					{/* foot */}
					<tfoot>
						<tr>
							<th>Họ và tên</th>
							<th>Email</th>
							<th>Quyền</th>
							<th>Vị trí</th>
							<th></th>
						</tr>
					</tfoot>
				</table>
			</div>
		</>
	);
};

export default withAuth(AuthOption.REQUIRED, User);
