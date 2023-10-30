import React, { useEffect, useState } from "react";
import { helpers } from "services";
import Actions from "modules/entity/actions";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import qs from "query-string";
import thousandsDivider from "../../../services/thousandsDivider/thousandsDivider";

const ExpensesCard = ({ location, params, setTotalCreditor, history }) => {
	const dispatch = useDispatch();
	const { t } = useTranslation("main");
	const query = qs.parse(location.search);
	const { lang } = query;

	const [tabLang, setTabLang] = useState(lang ? lang : "ru");

	const [categories, setCategories] = useState([]);
	const [totalCreditor, setTotalCreditors] = useState(0);

	const loadExpenseCategories = () => {
		dispatch(
			Actions.LoadDefault.request({
				url: `/dashboard/available-products`,
				params: {
					extra: {
						start_date: params.start_at && params.start_at,
						end_date: params.end_at && params.end_at,
						_l: tabLang
					},
					include: "translate"
				},
				cb: {
					success: data => {
						setCategories(data.data);
						setTotalCreditors(data.amount);
					},
					error: data => {}
				}
			})
		);
	};

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
					<span>{t("Остаток товаров")}</span>
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
								key={item.id}
								onClick={() =>
									history.push(
										`/stock/products?category=${item.category_id}`
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
					{thousandsDivider(totalCreditor)} {t("сум")}
				</span>
			</div>
		</div>
	);
};

export default ExpensesCard;
