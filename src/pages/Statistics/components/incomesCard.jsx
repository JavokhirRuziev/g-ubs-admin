import React, { useEffect, useState } from "react";
import { helpers } from "services";
import Actions from "modules/entity/actions";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { thousandsDivider } from "../../../services/thousandsDivider";

const IncomesCard = ({ params, setTotalIncome }) => {
	const dispatch = useDispatch();
	const { t } = useTranslation("main");
	const history = useHistory();

	const [incomesTransactions, setIncomesTransactions] = useState([]);
	const [total, setTotal] = useState();

	const loadTotalsByCategory = () => {
		dispatch(
			Actions.LoadDefault.request({
				url: `/dashboard/report-data`,
				params: {
					extra: {
						start_date: params.start_at && params.start_at,
						end_date: params.end_at && params.end_at
					}
				},
				cb: {
					success: data => {
						setIncomesTransactions(data);
						const sum = data.reduce(
							(total, item) => item.value + total,
							0
						);
						setTotal(sum);
						setTotalIncome(sum);
					},
					error: data => {}
				}
			})
		);
	};

	useEffect(() => {
		loadTotalsByCategory();
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
					<span>{t("Заказы")}</span>
					{!params.start_at && !params.end_at ? (
						<span>{t("За день")}</span>
					) : (
						<span>{t("За выбранный период")}</span>
					)}
				</div>
			</div>
			<div className="dashboard-card-st__body">
				{incomesTransactions.map(el => (
					<div
						className="dashboard-line --purple cursor-pointer"
						onClick={() =>
							history.push(`/orders?${[el.filter_by]}=${el.id}`)
						}>
						<span>{t(el.key)}</span>
						<div>
							{thousandsDivider(el.value)} {t("сум")}
						</div>
					</div>
				))}
			</div>
			<div className="dashboard-card-st__footer">
				<span>{t("Oбщая сумма")}:</span>
				<span>
					{helpers.convertToReadable(thousandsDivider(total))}{" "}
					{t("сум")}
				</span>
			</div>
		</div>
	);
};

export default IncomesCard;
