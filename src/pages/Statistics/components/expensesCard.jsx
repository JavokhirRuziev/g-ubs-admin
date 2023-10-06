import React, { useEffect, useState } from "react";
import { helpers } from "services";
import Actions from "modules/entity/actions";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import config from "../../../config";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import qs from "query-string";

const ExpensesCard = ({ params, location }) => {
	const dispatch = useDispatch();
	const { t } = useTranslation("main");
	const history = useHistory();
	const query = qs.parse(location.search);
	const { lang } = query;
	const [tabLang, setTabLang] = useState(lang ? lang : "ru");

	const [categories, setCategories] = useState([]);
	const [totalExpenses, setTotalExpenses] = useState(0);

	const loadExpensesByCategory = () => {
		dispatch(
			Actions.LoadDefault.request({
				url: `/dashboard/brought-products`,
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
						setTotalExpenses(data.amount);
					},
					error: data => {}
				}
			})
		);
	};

	useEffect(() => {
		loadExpensesByCategory();
	}, []);

	useEffect(() => {
		loadExpensesByCategory();
	}, [params.start_at, params.end_at]);

	return (
		<div className="dashboard-card-st">
			<div className="dashboard-card-st__head">
				<div className="--icon --icon-orange">
					<img src={require("../icons/icon-3.svg")} alt="" />
				</div>
				<div className="--title">
					<span>{t("Приход товаров")}</span>
					{!params.start_at && !params.end_at ? (
						<span>{t("За день")}</span>
					) : (
						<span>{t("За выбранный период")}</span>
					)}
				</div>
			</div>
			<div className="dashboard-card-st__body">
				{categories.length > 0 &&
					categories.map(item => {
						return (
							<div
								className="dashboard-line --red cursor-pointer"
								onClick={() =>
									history.push(
										`/stock/stock-brought-products?category=${item.category_id}&start_at=${params.start_at}&end_at=${params.end_at}`
									)
								}>
								<span>{item.name}</span>
								<div>
									{item.amount} {t("сум")}
								</div>
							</div>
						);
					})}
			</div>
			<div className="dashboard-card-st__footer">
				<span>{t("Oбщая сумма")}:</span>
				<span>
					{totalExpenses} {t("сум")}
				</span>
			</div>
		</div>
	);
};

export default ExpensesCard;
