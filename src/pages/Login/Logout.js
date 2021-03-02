import { useEffect } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Actions from "store/actions";

const Logout = ({ LogoutRequest }) => {

	useEffect(() => {
		LogoutRequest();
	}, []);

	return null;
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
	{
		LogoutRequest: Actions.auth.Logout.request
	},
	dispatch
);

export default connect(null, mapDispatchToProps)(Logout);
