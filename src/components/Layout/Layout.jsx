import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { NetworkError } from "components";
import Actions from "store/actions";
import "./style.scss";
import { useDispatch } from "react-redux";
import useMediaQueries from "../../services/media-queries";

const Layout = props => {
	const [isCollapsed, setCollapse] = useState(true);
	const [toggled, setToggle] = useState(true);
	const { children } = props;
	const dispatch = useDispatch();
	const { mobile } = useMediaQueries();

	useEffect(() => {
		const windowWidth = window.innerWidth;
		dispatch(Actions.system.SetWindowWidth.request(windowWidth));

		if (windowWidth <= 768) {
			setCollapse(false);
		}
	}, []);

	return (
		<div
			className={
				mobile
					? `m-layout m-layout--collapsed`
					: `m-layout ${isCollapsed ? "m-layout--collapsed" : ""}`
			}>
			<Sidebar
				{...{ isCollapsed, setCollapse, setToggle, toggled, mobile }}
			/>
			<div className={!mobile && "m-wrapper"}>
				<Header {...{ mobile, setToggle, toggled }} />

				<div className="m-content">{children}</div>
			</div>
		</div>
	);
};

export default Layout;
