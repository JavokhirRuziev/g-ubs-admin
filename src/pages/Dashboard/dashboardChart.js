import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useDispatch } from "react-redux";
import Actions from "modules/entity/actions";
import get from "lodash/get";
import { useTranslation } from "react-i18next";

const DashboardChart = ({ isDashboardOnly }) => {
	const dispatch = useDispatch();
	const [current, setCurrent] = useState([]);
	const [last, setLast] = useState([]);
	const [isFetched, setFetched] = useState(false);
	const { t } = useTranslation();


	useEffect(() => {
		loadChartData();
		const interval3 = setInterval(() => {
			if (isDashboardOnly) {
				loadChartData();
			}
		}, 11000);

		return () => {
			clearInterval(interval3);
		};
	}, []);

	const loadChartData = () => {
		setFetched(false);
		dispatch(Actions.LoadDefault.request({
			url: `/boss/boss/chart`,
			params: {
				limit: 100
			},
			cb: {
				success: data => {
					setCurrent(Object.values(data.current));
					setLast(Object.values(data.last));
					setFetched(true);
				},
				error: () => {
					setFetched(true);
				}
			}
		}));
	};

	const dataLineChart = {
		labels: ['01.02','02.02','03.02','04.02','05.02','06.02','07.02','08.02','09.02','10.02','11.02','12.02','13.02','14.02','15.02','16.02','17.02','18.02','19.02','20.02','21.02','22.02','23.02','24.02','25.02','26.02','27.02','28.02'],
		datasets: [
			{
				label: "Заказы (шт)",
				data: [6,8,15,7,8,6,2,4,4,5,6,8,5,7,8,6,5,4,4,5,6,8,5,7,8,6,4,4],
				backgroundColor: "rgba(255,255,255,0)",
				borderColor: "#00A389",
				pointHoverRadius: 10,
				pointRadius: 5,
				pointBorderColor: "#00A389",
				pointBackgroundColor: "#00A389"
			},
			{
				label: "Бронирование (шт)",
				data: [3,8,15,2,8,6,4,4,2,3,6,8,4,7,8,6,4,4,4,5,6,5,5,7,8,6,4,4],
				backgroundColor: "rgba(255,255,255,0)",
				borderColor: "#FFBB54",
				pointHoverRadius: 10,
				pointRadius: 5,
				pointBorderColor: "#FFBB54",
				pointBackgroundColor: "#FFBB54"
			},
			{
				label: "На стол (шт)",
				data: [2,8,7,2,8,6,7,4,4,5,6,8,15,7,8,6,1,4,3,5,6,8,2,7,8,6,4,4],
				backgroundColor: "rgba(255,255,255,0)",
				borderColor: "#03a9f4",
				pointHoverRadius: 10,
				pointRadius: 5,
				pointBorderColor: "#03a9f4",
				pointBackgroundColor: "#03a9f4"
			},
			{
				label: "Продажа (сум)",
				data: [2,2,3,4,2,3,3,4,2,5,6,8,10,7,8,6,5,4,4,5,6,8,9,9,9,4,3,4],
				backgroundColor: "rgba(255,255,255,0)",
				borderColor: "#9c27b0",
				pointHoverRadius: 10,
				pointRadius: 5,
				pointBorderColor: "#9c27b0",
				pointBackgroundColor: "#9c27b0"
			}
		]
	};
	const options = {
		scales: {
			xAxes: [{
				gridLines: {
					color: "#f0f5f9"
				}
			}]
		},
		layout: {
			padding: {
				left: 0,
				right: 10,
				top: 10,
				bottom: 0
			}
		},
		responsive: true,
		maintainAspectRatio: false,
		legend: {
			display: false
		}
	};

	return (
		<div>
			{isFetched && (
				<div className="dashboard-chart">

					<div className="dashboard-chart__content">
						<div className="dashboard-chart__data">
							<div className="dashboard-chart__head">
								<h3>{t("Графика заказов")}</h3>
							</div>

							<Line data={dataLineChart} options={options} />
						</div>
						<div className="dashboard-chart__info">
							<div>
								<span className="desc-ui desc-ui--green">{t("Заказы")}</span>
								<span>114 {t("шт")}</span>
							</div>
							<div>
								<span className="desc-ui desc-ui--yellow">{t("Бронирование")}</span>
								<span>54 {t("шт")}</span>
							</div>
							<div>
								<span className="desc-ui desc-ui--blue">{t("На стол")}</span>
								<span>65 {t("шт")}</span>
							</div>
							<div>
								<span className="desc-ui desc-ui--pink">{t("Доставка")}</span>
								<span>32 {t("шт")}</span>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default DashboardChart;
