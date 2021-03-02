import * as Sentry from "@sentry/browser";

export const init = () => {
	const { REACT_APP_SENTRY_DSN, REACT_APP_ENV } = process.env;

	if(REACT_APP_SENTRY_DSN){
		Sentry.init({
			dsn: REACT_APP_SENTRY_DSN,
			environment: REACT_APP_ENV
		});
	}
};

export default {
	init
};