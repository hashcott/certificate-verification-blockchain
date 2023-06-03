import {
	Formik,
	Form,
	Field,
	FormikState,
	FormikHelpers,
	useFormik,
} from "formik";
import * as Yup from "yup";
import { SetStateAction, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios, { AxiosError } from "axios";
import { AiTwotoneEdit } from "react-icons/ai";
import Link from "next/link";
import { Dispatch } from "../../../store/store";
import { Position, Role } from "../../../utils/types";
import { ErrorField } from "../../ErrorField";
import { AuthOption, withAuth } from "../../../utils/withAuth";
import UploadFile from "./UploadFile";

interface CreateUserFormProps {}

type CreateValues = {
	file: File | null;
};

const CreateUserForm: React.FC<CreateUserFormProps> = ({}) => {
	const [ApiErrors, setAPIErrors] = useState<any>({});
	const [ApiResponse, setAPIResponse] = useState<any>("");
	const dispatch = useDispatch<Dispatch>();

	const MAX_SIZE = 500000000; // 500KB
	const validateImage = (values: CreateValues) => {
		if (values.file && values.file.size > MAX_SIZE) {
			return { image: "Max file size exceeded." };
		}
	};

	const formik = useFormik<CreateValues>({
		initialValues: {
			file: null,
		}, // formik hook would include entire partner config
		onSubmit: (values) => submitCreateForm(values), // make request to service(s)
		validate: validateImage, // validate file type, size, etc.
	});

	const submitCreateForm = async (values: CreateValues) => {
		try {
			const res = await dispatch.user.createStudentWithFile(values);
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
					<UploadFile
						data={formik.values}
						errors={formik.errors}
						setFieldValue={formik.setFieldValue}
					/>
					<button
						onClick={() => formik.handleSubmit()}
						disabled={
							!formik.isValid ||
							(formik.values.file ? false : true)
						}
					>
						Upload
					</button>
				</div>
			</div>
		</>
	);
};

export default withAuth(AuthOption.REQUIRED, CreateUserForm);
