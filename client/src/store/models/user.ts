import { createModel } from "@rematch/core";
import axios, { AxiosError } from "axios";

import { RootModel } from ".";
import { Certification, CertificationStatus, User } from "../../utils/types";

interface UserState {
	authenticated: boolean;
	user: User | null;
	manager: User[];
	certifications: Certification[];
	certificationsFound: Certification[];
	currentCert: Certification | null;
}

const initialState: UserState = {
	authenticated: false,
	user: null,
	manager: [],
	certifications: [],
	certificationsFound: [],
	currentCert: null,
};

export const user = createModel<RootModel>()({
	name: "user",
	state: initialState,
	reducers: {
		SET_USER: (state, payload) => {
			return {
				...state,
				authenticated: true,
				user: payload,
			};
		},
		SET_MANAGER: (state, payload) => {
			return {
				...state,
				manager: payload,
			};
		},
		SET_CERT: (state, payload) => {
			return {
				...state,
				certifications: payload,
			};
		},
		UPDATE_CERT: (state, payload) => {
			return {
				...state,
				certifications: [...state.certifications, ...payload],
			};
		},
		UPDATE_CERT_FOUND: (state, payload) => {
			return {
				...state,
				certificationsFound: payload,
			};
		},
		UPDATE_CERT_STATUS: (state, payload) => {
			const cert = state.certifications.find(
				({ studentCode }) => studentCode === payload.providerId
			);
			console.log(cert);

			if (cert && state.user?.position) {
				cert[`isVerifiedBy${state.user?.position}`] = payload.status;
			}
			if (cert && payload.isCheck) {
				cert["certificationStatus"] = CertificationStatus.VERIFIED;
			}
			return {
				...state,
				certifications: [...state.certifications],
			};
		},
		UPDATE_MANAGER: (state, payload) => {
			return {
				...state,
				manager: [...state.manager, payload],
			};
		},
		SET_CURRENTCERT: (state, payload) => {
			return {
				...state,
				currentCert: payload,
			};
		},
		LOGOUT: (state) => {
			return {
				...state,
				authenticated: false,
				user: null,
				manager: [],
				student: [],
			};
		},
	},
	effects: (dispatch) => ({
		async localLoginAsync({ email, password }) {
			try {
				const { data } = await axios.post("/auth/local/login", {
					email,
					password,
				});
				dispatch.user.SET_USER(data.user);
				return data;
			} catch (err: any) {
				console.log(err);
				let axiosError: AxiosError;
				if (err instanceof AxiosError) {
					axiosError = err.response?.data;
					return axiosError;
				}
				return err;
			}
		},
		async localRegisterAsync({
			email,
			password = "123456",
			firstName,
			lastName,
			role,
			position,
		}) {
			try {
				const { data } = await axios.post("/auth/local/register", {
					email,
					password,
					firstName,
					lastName,
					role,
					position,
				});
				dispatch.user.UPDATE_MANAGER(data.user);
			} catch (err: any) {
				console.log(err);
				let axiosError: AxiosError;
				if (err instanceof AxiosError) {
					axiosError = err.response?.data;
					return axiosError;
				}
				return err;
			}
		},
		async logoutAsync() {
			try {
				await axios.delete("/auth/logout");
				dispatch.user.LOGOUT();
			} catch (err) {
				dispatch.user.LOGOUT();
			}
		},
		async getUserProfileAsync() {
			try {
				let { data } = await axios.get("/auth/me");
				console.log(data);
				dispatch.user.SET_USER(data.user);
			} catch (err) {
				dispatch.user.LOGOUT();
			}
		},
		async reconnect() {
			const ms = 2000;
			const recInterval = setInterval(async () => {
				try {
					let { data } = await axios.get("/auth/me");
					console.log(data);
					dispatch.user.SET_USER(data.user);
				} catch (err) {
					console.log(`Reconnection attempt failed`);
				}
			}, ms);
		},

		async listManager() {
			try {
				let { data } = await axios.get("/user/list-manager");
				console.log(data);
				dispatch.user.SET_MANAGER(data);
				console.log("Reconnected");
			} catch (err) {
				console.log(`Get list managers error`);
			}
		},

		async listStudentWithCert() {
			try {
				let { data } = await axios.get("/certification/list");
				console.log(data);
				dispatch.user.SET_CERT(data);
				console.log("Reconnected");
			} catch (err) {
				console.log(`Get list managers error`);
			}
		},

		async createStudentWithFile({ file }) {
			try {
				const formData = new FormData();
				formData.append("file", file);

				let { data } = await axios.post(
					"/certification/xlsx",
					formData,
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
					}
				);
				dispatch.user.UPDATE_CERT(data);
				console.log("Reconnected");
			} catch (err) {
				console.log(`Get list managers error`);
			}
		},

		async confirm({ providerId }) {
			try {
				let { data } = await axios.patch("/certification/confirm", {
					providerId,
				});
				if (
					data &&
					data.certificationStatus != CertificationStatus.VERIFIED
				) {
					dispatch.user.UPDATE_CERT_STATUS({
						providerId,
						status: true,
					});
				}
				console.log("Confirmed", providerId);
			} catch (err) {
				console.log(`Get list managers error`);
			}
		},
		async unconfirm({ providerId }) {
			try {
				let { data } = await axios.patch("/certification/confirm", {
					providerId,
				});
				if (data) {
					dispatch.user.UPDATE_CERT_STATUS({
						providerId,
						status: false,
					});
				}
				console.log("UnConfirmed", providerId);
			} catch (err) {
				console.log(`Get list managers error`);
			}
		},
		async search({ q }) {
			try {
				let { data } = await axios.get("/user/search", {
					params: {
						q,
					},
				});
				if (data) {
					dispatch.user.UPDATE_CERT_FOUND(data);
				}
				console.log("Found ", data.length);
			} catch (err) {
				console.log(`Get list managers error`);
			}
		},
		async getCert({ providerId }) {
			try {
				let { data } = await axios.get("/certification/getOne", {
					params: {
						providerId,
					},
				});
				if (data) {
					dispatch.user.SET_CURRENTCERT(data);
				}
				console.log("Found ", providerId);
			} catch (err) {
				console.log(`Get list managers error`);
			}
		},
	}),
});
