import { FunctionComponent } from "react";
import { FormikErrors } from "formik";

interface IUploadFile {
	data: { file: File | null };
	setFieldValue: (
		field: string,
		value: any,
		shouldValidate?: boolean | undefined
	) => Promise<FormikErrors<{ file?: File }>> | Promise<void>;
	errors: FormikErrors<{ file?: File }>;
}

const UploadFile: FunctionComponent<IUploadFile> = ({
	data,
	setFieldValue,
	errors,
}) => {
	return (
		<div>
			<input
				className="file-input w-full max-w-xs"
				type="file"
				name="file"
				// set supported file types here,
				// could also check again within formik validation or backend
				accept=".xlsx"
				onChange={(e) => {
					// Object is possibly null error w/o check
					if (e.currentTarget.files) {
						setFieldValue("file", e.currentTarget.files[0]);
					}
				}}
			/>
			{errors.file && (
				<>
					<br />
					<span id="error">{errors.file}</span>
					<br />
				</>
			)}
		</div>
	);
};

export default UploadFile;
