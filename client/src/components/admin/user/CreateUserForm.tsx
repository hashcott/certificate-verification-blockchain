import { Formik, Form, Field, FormikState, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios, { AxiosError } from "axios";
import { AiTwotoneEdit } from "react-icons/ai";
import Link from "next/link";
import { Dispatch } from "../../../store/store";
import { Position, Role } from "../../../utils/types";
import { ErrorField } from "../../ErrorField";
import { AuthOption, withAuth } from "../../../utils/withAuth";

interface CreateUserFormProps {}

type CreateValues = {
	firstName: string | null;
	lastName: string | null;
	email: string | null;
	role: Role | null;
	position: Position | null;
};

const CreateUserForm: React.FC<CreateUserFormProps> = ({}) => {
	const [ApiErrors, setAPIErrors] = useState<any>({});
	const [ApiResponse, setAPIResponse] = useState<any>("");
	const dispatch = useDispatch<Dispatch>();

	let createValues: CreateValues = {
		firstName: "",
		lastName: "",
		email: "",
		role: Role.MODERATOR,
		position: Position.DAOTAO,
	};

	const createSchema = Yup.object().shape({
		firstName: Yup.string()
			.required("First name cannot be empty or whitespace")
			.min(2, "First name must be between 3 and 30 characters long")
			.max(30, "First name must be between 3 and 30 characters long"),
		lastName: Yup.string()
			.required("Last name cannot be empty or whitespace")
			.min(3, "Last name must be between 3 and 50 characters long")
			.max(50, "Last name must be between 3 and 50 characters long"),
		email: Yup.string()
			.email()
			.required("Email cannot be empty or whitespace"),
		role: Yup.mixed<Role>().oneOf(Object.values(Role)).required(),
		position: Yup.mixed<Position>()
			.oneOf(Object.values(Position))
			.required(),
	});

	const submitCreateForm = async (
		values: CreateValues,
		helpers: FormikHelpers<CreateValues>
	) => {
		try {
			const res = await dispatch.user.localRegisterAsync(values);
		} catch (err) {
			if (err instanceof AxiosError) {
				setAPIResponse(err!.response!.data);
				setAPIErrors(err!.response!.data.errors);
			}
		}
	};

	return (
		<>
			<div>
				<div className="mx-auto w-96">
					{ApiResponse.success ? (
						<p className="p-4 m-10 mx-auto font-bold text-center border text-md text-success rounded-xl border-success">
							{ApiResponse.message}
						</p>
					) : ApiResponse.message ? (
						<p className="p-4 m-10 mx-auto font-bold text-center border rounded-xl border-error text-md text-error">
							{ApiResponse.message}
						</p>
					) : null}
					<Formik
						initialValues={createValues}
						onSubmit={submitCreateForm}
						validationSchema={createSchema}
					>
						{({
							isSubmitting,
							errors,
							touched,
						}: FormikState<CreateValues>) => (
							<Form>
								<div>
									<div className="form-control">
										<label className="label">
											<span className="font-semibold label-text">
												Họ và đệm
											</span>
										</label>
										<Field
											placeholder="Enter your first name"
											type="text"
											name="firstName"
											className={`w-full p-3 transition duration-200 rounded input`}
										/>
										<label className="label">
											{errors.firstName &&
											touched.firstName ? (
												<ErrorField
													error={errors.firstName}
												/>
											) : null}
											{ApiErrors &&
											ApiErrors.firstName &&
											touched.firstName ? (
												<ErrorField
													error={ApiErrors.firstName}
												/>
											) : null}
										</label>
									</div>
								</div>
								<div>
									<div className="form-control">
										<label className="label">
											<span className="font-semibold label-text">
												Tên
											</span>
										</label>
										<Field
											placeholder="Enter your last name"
											type="text"
											name="lastName"
											className={`w-full p-3 transition duration-200 rounded input`}
										/>
										<label className="label">
											{errors.lastName &&
											touched.lastName ? (
												<ErrorField
													error={errors.lastName}
												/>
											) : null}
											{ApiErrors &&
											ApiErrors.lastName &&
											touched.lastName ? (
												<ErrorField
													error={ApiErrors.lastName}
												/>
											) : null}
										</label>
									</div>
								</div>

								<div>
									<div className="form-control">
										<label className="label">
											<span className="font-semibold label-text">
												Email
											</span>
										</label>
										<Field
											placeholder="Enter your email"
											type="email"
											name="email"
											className={`w-full p-3 transition duration-200 rounded input`}
										/>
										<label className="label">
											{errors.email && touched.email ? (
												<ErrorField
													error={errors.email}
												/>
											) : null}
											{ApiErrors &&
											ApiErrors.email &&
											touched.email ? (
												<ErrorField
													error={ApiErrors.email}
												/>
											) : null}
										</label>
									</div>
								</div>

								<div>
									<div className="form-control">
										<label className="label">
											<span className="font-semibold label-text">
												Quyền truy cập
											</span>
										</label>
										<Field
											as="select"
											name="role"
											className="select select-bordered w-full max-w-xs"
										>
											<option value={Role.ADMIN}>
												Admin
											</option>
											<option value={Role.MODERATOR}>
												Moderator
											</option>
										</Field>
										<label className="label">
											{errors.role && touched.role ? (
												<ErrorField
													error={errors.role}
												/>
											) : null}
											{ApiErrors &&
											ApiErrors.role &&
											touched.role ? (
												<ErrorField
													error={ApiErrors.role}
												/>
											) : null}
										</label>
									</div>
								</div>

								<div>
									<div className="form-control">
										<label className="label">
											<span className="font-semibold label-text">
												Vị trí
											</span>
										</label>
										<Field
											as="select"
											name="position"
											className="select select-bordered w-full max-w-xs"
										>
											<option value={Position.DAOTAO}>
												Phòng đào tạo
											</option>
											<option value={Position.TAIVU}>
												Phòng tại vụ
											</option>
											<option value={Position.THUVIEN}>
												QL Thư viện
											</option>
											<option value={Position.KTX}>
												QL KTX
											</option>
											<option value={Position.KHOA}>
												Khoa
											</option>
											<option value={Position.HT}>
												Hiệu trưởng
											</option>
										</Field>
										<label className="label">
											{errors.position &&
											touched.position ? (
												<ErrorField
													error={errors.position}
												/>
											) : null}
											{ApiErrors &&
											ApiErrors.position &&
											touched.position ? (
												<ErrorField
													error={ApiErrors.position}
												/>
											) : null}
										</label>
									</div>
								</div>

								<button
									type="submit"
									disabled={isSubmitting}
									className={`w-full btn font-semibold ${
										isSubmitting ? "btn loading" : ""
									}`}
								>
									<AiTwotoneEdit />{" "}
									<p className="ml-2">Tạo mới</p>
								</button>
							</Form>
						)}
					</Formik>
				</div>
			</div>
		</>
	);
};

export default withAuth(AuthOption.REQUIRED, CreateUserForm);
