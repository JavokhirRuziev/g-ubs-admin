import React, { useEffect, useState } from "react";
import { helpers } from "../../../services";
import { useTranslation } from "react-i18next";
import Actions from "../../../modules/entity/actions";
import { useDispatch } from "react-redux";
import { thousandsDivider } from "../../../services/thousandsDivider";
import axios from "axios";
import config from "config";

const CashboxCard = ({ params, totalExpense, totalIncome }) => {
	const { t } = useTranslation("main");
	const dispatch = useDispatch();

	const [solves, setSolves] = useState([]);
	const [residual, setResidual] = useState([]);
	const [expenses, setExpenses] = useState();

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
		loadSolves();
		loadResidualByPaymentType();
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
				<div className="dashboard-line --purple">
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
				<div className="dashboard-line --purple">
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
				<div className="dashboard-line --purple">
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
									<span>{t("Наличные")}</span>
								)}
								{item === "online" && (
									<span>{t("Онлайн")}</span>
								)}
								{item === "terminal" && (
									<span>{t("Терминал")}</span>
								)}
								<div>
									{residual[item]
										? helpers.convertToReadable(
												thousandsDivider(residual[item])
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
