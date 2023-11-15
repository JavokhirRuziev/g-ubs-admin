import React, { useEffect, useState } from "react";
import { helpers } from "../../../services";
import { useTranslation } from "react-i18next";
import Actions from "../../../modules/entity/actions";
import { useDispatch } from "react-redux";
import thousandsDivider from "../../../services/thousandsDivider/thousandsDivider";
import moment from "moment";

const SalesCard = ({ params, setTotalSale, history }) => {
	const { t } = useTranslation("main");
	const dispatch = useDispatch();

	const [totalSales, setTotalSales] = useState(0);
	const [incomesSalesTransactions, setIncomesSalesTransactions] = useState(
		[]
	);
	const [start_at, setStart_at] = useState();
	const [end_at, setEnd_at] = useState();

	const loadIncomesBySales = () => {
		dispatch(
			Actions.LoadDefault.request({
				url: `/transactions/incomes-by-sales`,
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
						const totalA = data
							.filter(i => i.price_type !== 5)
							.reduce((prev, curr) => prev + Number(curr.sum), 0);

						setIncomesSalesTransactions(data);
						setTotalSales(total);
						setTotalSale(total);
					},
					error: data => {}
				}
			})
		);
	};

	useEffect(() => {
		loadIncomesBySales();
	}, [params.start_at, params.end_at]);

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

	const paymentTypes = [
		{ price_type: 1, title: "Наличные" },
		{ price_type: 4, title: "Терминал" },
		{ price_type: 7, title: "Онлайн" },
		{ price_type: 5, title: "Долг" },
		{ price_type: 6, title: "VIP" }
	];
	return (
		<div className="dashboard-card-st">
			<div className="dashboard-card-st__head">
				<div className="--icon --icon-green">
					<img src={require("../icons/icon-1.svg")} alt="" />
				</div>
				<div className="--title">
					<span>{t("Сумма продаж")}</span>
					{!params.start_at && !params.end_at ? (
						<span>{t("За день")}</span>
					) : (
						<span>{t("За выбранный период")}</span>
					)}
				</div>
			</div>
			<div className="dashboard-card-st__body">
				{paymentTypes.map(item => {
					const hasSum = incomesSalesTransactions.find(
						t => t.price_type === item.price_type
					);
					return (
						<div
							className="dashboard-line --purple cursor-pointer"
							onClick={() =>
								history.push(
									`/orders?payment_type=${item.price_type}/${item.title}&start_at=${start_at}&end_at=${end_at}`
								)
							}>
							<span>{t(item.title)}</span>
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
				})}
			</div>
			<div className="dashboard-card-st__footer">
				<span>{t("Oбщая сумма")}:</span>
				<span>
					{helpers.convertToReadable(thousandsDivider(totalSales))}{" "}
					{t("сум")}
				</span>
			</div>
		</div>
	);
};

export default SalesCard;
