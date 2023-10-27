import React, { useEffect, useState } from "react";
import { helpers } from "../../../services";
import { useTranslation } from "react-i18next";
import Actions from "../../../modules/entity/actions";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import thousandsDivider from "../../../services/thousandsDivider/thousandsDivider";

const CashboxCard = ({ params, totalExpense, totalIncome }) => {
	const { t } = useTranslation("main");
	const dispatch = useDispatch();
	const [total, setTotal] = useState();
	const [body, setBody] = useState();
	const history = useHistory();

	const loadSolves = () => {
		dispatch(
			Actions.LoadDefault.request({
				url: `/dashboard/available-dishes/amount`,
				params: {
					extra: {
						start_date: params.start_at && params.start_at,
						end_date: params.end_at && params.end_at
					},
					include: "translate"
				},
				cb: {
					success: data => {
						setTotal(data.amount);
						setBody(data.data);
					},
					error: data => {}
				}
			})
		);
	};

	useEffect(() => {
		loadSolves();
	}, [params.start_at, params.end_at]);

	return (
		<div className="dashboard-card-st">
			<div className="dashboard-card-st__head">
				<div className="--icon --icon-purple">
					<img src={require("../icons/icon-4.svg")} alt="" />
				</div>
				<div className="--title">
					<span>{t("Готовый продукт")}</span>
					{!params.start_at && !params.end_at ? (
						<span>{t("За день")}</span>
					) : (
						<span>{t("За выбранный период")}</span>
					)}
				</div>
			</div>
			<div className="dashboard-card-st__body">
				{body &&
					body.map(el => (
						<div
							className="dashboard-line --purple cursor-pointer"
							onClick={() =>
								history.push(
									`/finished-dishes?kitchener_id=${el.kitchener_id}`
								)
							}>
							<span>{t(el.name)}</span>
							<div>
								{thousandsDivider(el.amount)} {t("сум")}
							</div>
						</div>
					))}
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

export default CashboxCard;
