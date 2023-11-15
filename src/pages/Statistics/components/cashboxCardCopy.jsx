import React, { useEffect, useState } from "react";
import { helpers } from "../../../services";
import { useTranslation } from "react-i18next";
import Actions from "../../../modules/entity/actions";
import { useDispatch } from "react-redux";
import axios from "axios";
import config from "config";
import thousandsDivider from "../../../services/thousandsDivider/thousandsDivider";
import moment from "moment";

const CashboxCard = ({ params, totalExpense, history }) => {
	const { t } = useTranslation("main");
	const dispatch = useDispatch();

	const [solves, setSolves] = useState([]);
	const [residual, setResidual] = useState([]);
	const [expenses, setExpenses] = useState();
	const [totalIncome, setTotalIncome] = useState();
	const [start_at, setStart_at] = useState();
	const [end_at, setEnd_at] = useState();

	const loadIncome = () => {
		dispatch(
			Actions.LoadDefault.request({
				url: `/dashboard/cash-register-income`,
				params: {
					extra: {
						start_date: params.start_at && params.start_at,
						end_date: params.end_at && params.end_at
					}
				},
				cb: {
					success: data => {
						setTotalIncome(data.value);
						console.log();
					},
					error: data => {}
				}
			})
		);
	};

	const loadSolves = () => {
		dispatch(
			Actions.LoadDefault.request({
				url: `/transactions/solves`,
				params: {
					extra: {
						start_date: params.start_at && params.start_at,
						end_date: params.end_at && params.end_at
					}
				},
				cb: {
					success: data => {
						setSolves(data);
					},
					error: data => {}
				}
			})
		);
	};

	const loadResidualByPaymentType = () => {
		dispatch(
			Actions.LoadDefault.request({
				url: `/transactions/residual-by-payment-type`,
				params: {
					extra: {
						start_date: params.start_at && params.start_at,
						end_date: params.end_at && params.end_at
					}
				},
				cb: {
					success: data => {
						setResidual(data);
					},
					error: data => {}
				}
			})
		);
	};

	useEffect(() => {
		axios
			.get(
				`${config.API_ROOT}/transactions/expenses-by-category-cash-register`
			)
			.then(res => {
				const expensesTotal = res.data.reduce(
					(total, el) => Number(el.sum) + total,
					0
				);
				setExpenses(expensesTotal);
			})
			.catch(err => console.log(err));
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
		loadSolves();
		loadResidualByPaymentType();
		loadIncome();
	}, [params.start_at, params.end_at]);

	return (
		<div className="dashboard-card-st">
			<div className="dashboard-card-st__head">
				<div className="--icon --icon-purple">
					<img src={require("../icons/icon-4.svg")} alt="" />
				</div>
				<div className="--title">
					<span>{t("Касса")}</span>
					{!params.start_at && !params.end_at ? (
						<span>{t("За день")}</span>
					) : (
						<span>{t("За выбранный период")}</span>
					)}
				</div>
			</div>
			<div className="dashboard-card-st__body">
				<div
					className="dashboard-line --purple cursor-pointer"
					onClick={() =>
						history.push(
							`/incomes?is_cash_register=true&start_at=${start_at}&end_at=${end_at}`
						)
					}>
					<span>{t("Приход")}</span>
					<div>
						{totalIncome
							? helpers.convertToReadable(
									thousandsDivider(totalIncome)
							  )
							: 0}{" "}
						{t("сум")}
					</div>
				</div>
				<div
					className="dashboard-line --purple cursor-pointer"
					onClick={() =>
						history.push(
							`/expenses?is_cash_register=true&start_at=${start_at}&end_at=${end_at}`
						)
					}>
					<span>{t("Расход")}</span>
					<div>
						{totalExpense
							? helpers.convertToReadable(
									thousandsDivider(expenses)
							  )
							: 0}{" "}
						{t("сум")}
					</div>
				</div>
				<div
					className="dashboard-line --purple cursor-pointer"
					onClick={() =>
						history.push(
							`/solved?is_cash_register=true&start_at=${start_at}&end_at=${end_at}`
						)
					}>
					<span>{t("Снять денги")}</span>
					<div>
						{helpers.convertToReadable(thousandsDivider(solves))}{" "}
						{t("сум")}
					</div>
				</div>

				<div className="mt-20" />

				{residual && Object.keys(residual).length > 0 ? (
					Object.keys(residual).map(item => {
						return (
							<div className="dashboard-line --green">
								{item === "cash" && (
									<span
										className="cursor-pointer"
										onClick={() =>
											history.push(
												`/incomes?price_type=${residual["cash"].key}&is_cash_register=true&start_at=${start_at}&end_at=${end_at}`
											)
										}>
										{t("Наличные")}
									</span>
								)}
								{item === "online" && (
									<span
										className="cursor-pointer"
										onClick={() =>
											history.push(
												`/incomes?price_type=${residual["online"].key}&is_cash_register=true&start_at=${start_at}&end_at=${end_at}`
											)
										}>
										{t("Онлайн")}
									</span>
								)}
								{item === "terminal" && (
									<span
										className="cursor-pointer"
										onClick={() =>
											history.push(
												`/incomes?price_type=${residual["terminal"].key}&is_cash_register=true&start_at=${start_at}&end_at=${end_at}`
											)
										}>
										{t("Терминал")}
									</span>
								)}
								<div>
									{residual[item]
										? helpers.convertToReadable(
												thousandsDivider(
													residual[item].value
												)
										  )
										: 0}{" "}
									{t("сум")}
								</div>
							</div>
						);
					})
				) : (
					<div />
				)}
			</div>
			<div className="dashboard-card-st__footer">
				<span>{t("Oбщая сумма")}:</span>
				<span>
					{helpers.convertToReadable(
						thousandsDivider(totalIncome - expenses - solves)
					)}{" "}
					{t("сум")}
				</span>
			</div>
		</div>
	);
};

export default CashboxCard;
