import React, { useEffect, useState } from "react";
import { helpers } from "services";
import Actions from "modules/entity/actions";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import config from "config";
import thousandsDivider from "../../../services/thousandsDivider/thousandsDivider";
import moment from "moment";

const IncomesCardCopy = ({ params, setTotalIncome, history }) => {
	const dispatch = useDispatch();
	const { t } = useTranslation("main");

	const [categories, setCategories] = useState([]);
	const [incomesTransactions, setIncomesTransactions] = useState([]);
	const [totalIncomes, setTotalIncomes] = useState(0);
	const [start_at, setStart_at] = useState();
	const [end_at, setEnd_at] = useState();

	const loadTotalsByCategory = () => {
		dispatch(
			Actions.LoadDefault.request({
				url: `/transactions/incomes-by-category`,
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

						setIncomesTransactions(data);
						setTotalIncomes(total);
						setTotalIncome(total);
					},
					error: data => {}
				}
			})
		);
	};
	const loadCategories = () => {
		dispatch(
			Actions.LoadDefault.request({
				url: `/expense-categories`,
				params: {
					filter: { type: config.INCOME_CATEGORY_TYPE }
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
		loadCategories();
	}, []);
	useEffect(() => {
		loadTotalsByCategory();
	}, [params.start_at, params.end_at]);

	return (
		<div className="dashboard-card-st">
			<div className="dashboard-card-st__head">
				<div className="--icon --icon-blue">
					<img src={require("../icons/icon-2.svg")} alt="" />
				</div>
				<div className="--title">
					<span>{t("Приходы")}</span>
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
						const hasSum = incomesTransactions.find(
							a => a.alias === item.alias
						);
						return (
							<div
								className="dashboard-line --purple cursor-pointer"
								onClick={() =>
									history.push(
										`/incomes?category=${item.id}&start_at=${start_at}&end_at=${end_at}`
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
					{helpers.convertToReadable(thousandsDivider(totalIncomes))}{" "}
					{t("сум")}
				</span>
			</div>
		</div>
	);
};

export default IncomesCardCopy;
