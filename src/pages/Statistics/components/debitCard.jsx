import React, { useEffect, useState } from "react";
import Actions from "modules/entity/actions";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import qs from "query-string";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import thousandsDivider from "../../../services/thousandsDivider/thousandsDivider";
import moment from "moment";

const ExpensesCard = ({ params, setTotalDebtor, location }) => {
	const dispatch = useDispatch();
	const { t } = useTranslation("main");

	const [categories, setCategories] = useState([]);
	const [total, setTotal] = useState();
	const query = qs.parse(location.search);
	const { lang } = query;
	const [tabLang, setTabLang] = useState(lang ? lang : "ru");
	const history = useHistory();
	const [start_at, setStart_at] = useState();
	const [end_at, setEnd_at] = useState();

	const loadExpenseCategories = () => {
		dispatch(
			Actions.LoadDefault.request({
				url: `/dashboard/distributed-products`,
				params: {
					extra: {
						start_date: params.start_at && params.start_at,
						end_date: params.end_at && params.end_at,
						_l: tabLang
					}
				},
				cb: {
					success: data => {
						setCategories(data.data);
						setTotal(data.amount);
					},
					error: data => {}
				}
			})
		);
	};

	useEffect(() => {
		loadExpenseCategories();
	}, []);

	useEffect(() => {
		const intervalId = setInterval(() => {
			const timestamp = Math.floor(Date.now() / 1000);
			const start_at = params.start_at
				? params.start_at
				: moment(new Date(timestamp * 1000).toLocaleString()).unix();
			const end_at = params.end_at
				? params.end_at
				: moment(new Date(timestamp * 1000).toLocaleString()).unix();
			setStart_at(start_at);
			setEnd_at(end_at);
		}, 1000);

		return () => clearInterval(intervalId);
	}, []);

	useEffect(() => {
		loadExpenseCategories();
	}, [params.start_at, params.end_at]);

	return (
		<div className="dashboard-card-st">
			<div className="dashboard-card-st__head">
				<div className="--icon --icon-orange">
					<img src={require("../icons/icon-3.svg")} alt="" />
				</div>
				<div className="--title">
					<span>{t("Расход товаров")}</span>
					{!params.start_at && !params.end_at ? (
						<span>{t("За день")}</span>
					) : (
						<span>{t("За выбранный период")}</span>
					)}
				</div>
			</div>
			<div className="dashboard-card-st__body">
				{categories.length > 0 ? (
					categories.map(item => {
						return (
							<div
								className="dashboard-line --red cursor-pointer"
								key={item.category_id}
								onClick={
									item.name !== "Перерасчет"
										? () =>
												history.push(
													`/stock/stock-distributed-products?category_name=${item.name}&category=${item.category_id}&start_at=${start_at}&end_at=${end_at}`
												)
										: () =>
												history.push(
													`/recalculation-products?start_at=${start_at}&end_at=${end_at}`
												)
								}>
								<span>{item.name}</span>
								<div>
									{thousandsDivider(item.amount)} {t("сум")}
								</div>
							</div>
						);
					})
				) : (
					<div>-</div>
				)}
			</div>
			<div className="dashboard-card-st__footer">
				<span>{t("Oбщая сумма")}:</span>
				<span>
					{thousandsDivider(total)} {t("сум")}
				</span>
			</div>
		</div>
	);
};

export default ExpensesCard;
