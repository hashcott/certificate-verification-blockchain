import { createModel } from "@rematch/core";
import axios, { AxiosError } from "axios";

import { RootModel } from ".";
import { User } from "../../utils/types";

interface UserState {
	authenticated: boolean;
	user: User | null;
	manager: User[];
	student: User[];
}

const initialState: UserState = {
	authenticated: false,
	user: null,
	manager: [],
	student: [],
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
		SET_STUDENT: (state, payload) => {
			return {
				...state,
				student: payload,
			};
		},
		UPDATE_STUDENT: (state, payload) => {
			return {
				...state,
				student: [...state.student, ...payload],
			};
		},
		UPDATE_MANAGER: (state, payload) => {
			return {
				...state,
				manager: [...state.manager, payload],
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
			displayName,
			role,
			position,
		}) {
			try {
				const { data } = await axios.post("/auth/local/register", {
					email,
					password,
					firstName,
					lastName,
					displayName,
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
		async socialLoginAsync() {
			let { data } = await axios.get("/auth/me");
			console.log(data);
			dispatch.user.SET_USER(data.user);
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
				let { data } = await axios.get("/user/list");
				console.log(data);
				dispatch.user.SET_STUDENT(data);
				console.log("Reconnected");
			} catch (err) {
				console.log(`Get list managers error`);
			}
		},

		async createStudentWithFile({ file }) {
			try {
				const formData = new FormData();
				formData.append("file", file);

				let { data } = await axios.post("/user/xlsx", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});
				dispatch.user.UPDATE_STUDENT(data);
				console.log("Reconnected");
			} catch (err) {
				console.log(`Get list managers error`);
			}
		},
	}),
});
