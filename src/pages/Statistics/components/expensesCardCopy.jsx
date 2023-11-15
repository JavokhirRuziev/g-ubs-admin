import React, { useEffect, useState } from "react";
import { helpers } from "services";
import Actions from "modules/entity/actions";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import config from "../../../config";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import thousandsDivider from "../../../services/thousandsDivider/thousandsDivider";
import moment from "moment";

const ExpensesCardCopy = ({ params, setTotalExpense }) => {
	const dispatch = useDispatch();
	const { t } = useTranslation("main");
	const history = useHistory();

	const [categories, setCategories] = useState([]);
	const [expensesTransactions, setExpensesTransactions] = useState([]);
	const [totalExpenses, setTotalExpenses] = useState(0);
	const [shopping, setShopping] = useState();
	const [start_at, setStart_at] = useState();
	const [end_at, setEnd_at] = useState();

	const loadExpensesByCategory = () => {
		dispatch(
			Actions.LoadDefault.request({
				url: `/transactions/expenses-by-category`,
				params: {
					extra: {
						start_date: params.start_at && params.start_at,
						end_date: params.end_at && params.end_at
					}
				},
				cb: {
					success: data => {
						const total = data.reduce(
							(prev, curr) => prev + Number(curr.sum),
							0
						);

						setExpensesTransactions(data);
						setTotalExpenses(total);
						setTotalExpense(total);
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
					extra: {
						not: "sale"
					},
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

	const getShopping = () => {
		dispatch(
			Actions.LoadDefault.request({
				url: `/dashboard/shopping-data`,
				params: {
					extra: {
						start_date: params.start_at && params.start_at,
						end_date: params.end_at && params.end_at
					}
				},
				cb: {
					success: data => {
						setShopping(data);
					},
					error: data => {}
				}
			})
		);
	};

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
		getShopping();
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
					<span>{t("Расходы")}</span>
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
						const hasSum = expensesTransactions.find(
							a => a.alias === item.alias
						);
						return (
							<div
								className="dashboard-line --red cursor-pointer"
								onClick={() =>
									history.push(
										`/expenses?category=${item.id}&start_at=${start_at}&end_at=${end_at}`
									)
								}>
								<span>{item.title}</span>
								<div>
									{hasSum
										? helpers.convertToReadable(
												thousandsDivider(hasSum.sum)
										  )
										: 0}{" "}
									{t("сум")}
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
					{helpers.convertToReadable(thousandsDivider(totalExpenses))}{" "}
					{t("сум")}
				</span>
			</div>
		</div>
	);
};

export default ExpensesCardCopy;
