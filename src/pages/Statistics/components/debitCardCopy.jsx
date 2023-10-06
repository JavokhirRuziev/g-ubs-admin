import React, { useEffect, useState } from "react";
import { helpers } from "services";
import Actions from "modules/entity/actions";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import config from "../../../config";

const ExpensesCard = ({ params, setTotalDebtor }) => {
	const dispatch = useDispatch();
	const { t } = useTranslation("main");

	const [categories, setCategories] = useState([]);
	const [creditorTransactions, setCreditorTransactions] = useState([]);
	const [totalDebtor, setTotalDebtors] = useState(0);

	const loadExpensesByCategory = () => {
		dispatch(
			Actions.LoadDefault.request({
				url: `/transactions/borrowed-by-category`,
				params: {
					extra: {
						start_date: params.start_at && params.start_at,
						end_date: params.end_at && params.end_at
					}
				},
				cb: {
					success: data => {
						const total = data.reduce(
							(prev, curr) =>
								prev +
								(Number(curr.sum) < 0
									? Number(curr.sum) * -1
									: 0),
							0
						);
						setCreditorTransactions(data);
						setTotalDebtors(total * -1);
						setTotalDebtor(total * -1);
					},
					error: data => {}
				}
			})
		);
	};
	const loadExpenseCategories = () => {
		dispatch(
			Actions.LoadDefault.request({
				url: `/expense-categories`,
				params: {
					filter: { type: config.EXPENSE_CATEGORY_TYPE }
				},
				cb: {
					success: data => {
						setCategories(data.data);
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
		loadExpensesByCategory();
	}, [params.start_at, params.end_at]);

	return (
		<div className="dashboard-card-st">
			<div className="dashboard-card-st__head">
				<div className="--icon --icon-orange">
					<img src={require("../icons/icon-3.svg")} alt="" />
				</div>
				<div className="--title">
					<span>{t("Дебиторка")}</span>
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
						const itemsByCategory = creditorTransactions.filter(
							a => a.alias === item.alias
						);
						const totalSum = itemsByCategory.reduce(
							(prev, curr) =>
								prev +
								(Number(curr.sum) < 0 ? Number(curr.sum) : 0),
							0
						);

						return item.alias !== "vip" ? (
							<div className="dashboard-line --red" key={item.id}>
								<span>
									{item.title === t("Сотувдан")
										? t("Клиент")
										: item.title}
								</span>
								<div>
									{helpers.convertToReadable(totalSum * -1)}{" "}
									{t("сум")}
								</div>
							</div>
						) : (
							<></>
						);
					})
				) : (
					<div>-</div>
				)}
			</div>
			<div className="dashboard-card-st__footer">
				<span>{t("Oбщая сумма")}:</span>
				<span>
					{helpers.convertToReadable(totalDebtor)} {t("сум")}
				</span>
			</div>
		</div>
	);
};

export default ExpensesCard;
