import axios from "axios";
import get from "lodash/get";
import * as Sentry from "@sentry/browser";
import config from "config";
import storage from "../storage";

const request = axios.create({
	baseURL: config.API_ROOT
});

request.defaults.params = {};
request.defaults.params["_f"] = "json";
request.defaults.headers.common["Accept"] = "application/json";
request.defaults.headers.common["Cache-Control"] = "no-cache";
request.defaults.headers.common["Content-Type"] =
	"application/json; charset=utf-8";

let token = storage.get("token");
const subscribe = store => {
	let state = store.getState();
	// request.defaults.params['_l'] = state.system.currentLangCode;

	if (state.auth.token) token = get(state, "auth.token");
	// console.log(get(state, "auth.token"));
	if (token) {
		request.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	}
};

/**
 * API Sentry Error Tracker
 */
request.interceptors.response.use(
	response => response,
	error => {
		const expectedError =
			error.response &&
			error.response.status >= 400 &&
			error.response.status < 500;

		if (!expectedError) {
			Sentry.withScope(scope => {
				scope.setExtra("Error URL", get(error, "config.url"));
				scope.setExtra(
					"Error Message",
					get(error, "response.data.message")
				);
				scope.setExtra(
					"Error Status",
					`${get(error, "response.status")} - ${get(
						error,
						"response.statusText"
					)}`
				);
				scope.setExtra("Error Full", error);
				Sentry.captureException(error);
			});
		}

		return Promise.reject(error);
	}
);

export default {
	request,
	subscribe
};
