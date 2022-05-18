import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import moment from "moment";

const DashboardChart = ({isFetched, chartInfo}) => {
	const [dataBooking, setDataBooking] = useState([]);
	const [dataDelivery, setDataDelivery] = useState([]);
	const [dataOnTable, setDataOnTable] = useState([]);
	const [dataTakeaway, setDataTakeaway] = useState([]);

	const { t } = useTranslation();
	const daysOnMonth = moment().endOf('month').format('DD');

	const formatDate = value => {
		const a = value.split(" ")[0];
		const month = a.split("-")[1]
		const day = a.split("-")[2]
		return day + "-" + month;
	}
	const dataLineChart = {
		labels: dataBooking.reduce((prev,curr) => [...prev, formatDate(curr.date)], []),
		datasets: [
			{
				label: "Доставка (шт)",
				data: dataDelivery.reduce((prev,curr) => [...prev, curr.count], []),
				backgroundColor: "rgba(255,255,255,0)",
				borderColor: "#00A389",
				pointHoverRadius: 10,
				pointRadius: 5,
				pointBorderColor: "#00A389",
				pointBackgroundColor: "#00A389"
			},
			{
				label: "Бронирование (шт)",
				data: dataBooking.reduce((prev,curr) => [...prev, curr.count], []),
				backgroundColor: "rgba(255,255,255,0)",
				borderColor: "#FFBB54",
				pointHoverRadius: 10,
				pointRadius: 5,
				pointBorderColor: "#FFBB54",
				pointBackgroundColor: "#FFBB54"
			},
			{
				label: "На стол (шт)",
				data: dataOnTable.reduce((prev,curr) => [...prev, curr.count], []),
				backgroundColor: "rgba(255,255,255,0)",
				borderColor: "#03a9f4",
				pointHoverRadius: 10,
				pointRadius: 5,
				pointBorderColor: "#03a9f4",
				pointBackgroundColor: "#03a9f4"
			},
			{
				label: "Собой (шт)",
				data: dataTakeaway.reduce((prev,curr) => [...prev, curr.count], []),
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

	useEffect(() => {
		//Booking
		const booking = get(chartInfo, 'chart.booking', []);
		const date = moment(get(booking, "[0].date"));
		const newDataBooking = [...Array(Number(daysOnMonth))].map((item, i) => {
			const currentDay = moment(`${date.year()}-${date.month() + 1}-${i + 1} 12:00:00`);
			const day = currentDay.dayOfYear();
			const hasDate = booking.find(j => Number(j.doy) === day);
			if (hasDate) {
				return hasDate;
			}
			return {
				count: get(item, "count", 0),
				date: get(item, "date", currentDay.format("YYYY-MM-DD HH:mm:ss")),
				doy: String(currentDay.dayOfYear())
			};
		});
		setDataBooking(newDataBooking);

		//Delivery
		const delivery = get(chartInfo, 'chart.delivery', []);
		const date2 = moment(get(delivery, "[0].date"));
		const newDataDelivery = [...Array(Number(daysOnMonth))].map((item, i) => {
			const currentDay = moment(`${date2.year()}-${date.month() + 1}-${i + 1} 12:00:00`);
			const day = currentDay.dayOfYear();
			const hasDate = delivery.find(j => Number(j.doy) === day);
			if (hasDate) {
				return hasDate;
			}
			return {
				count: get(item, "count", 0),
				date: get(item, "date", currentDay.format("YYYY-MM-DD HH:mm:ss")),
				doy: String(currentDay.dayOfYear())
			};
		});
		setDataDelivery(newDataDelivery);

		//OnTable
		const onTable = get(chartInfo, 'chart.on_table', []);
		const date3 = moment(get(onTable, "[0].date"));
		const newDataOnTable = [...Array(Number(daysOnMonth))].map((item, i) => {
			const currentDay = moment(`${date3.year()}-${date.month() + 1}-${i + 1} 12:00:00`);
			const day = currentDay.dayOfYear();
			const hasDate = onTable.find(j => Number(j.doy) === day);
			if (hasDate) {
				return hasDate;
			}
			return {
				count: get(item, "count", 0),
				date: get(item, "date", currentDay.format("YYYY-MM-DD HH:mm:ss")),
				doy: String(currentDay.dayOfYear())
			};
		});
		setDataOnTable(newDataOnTable);

		//OnTable
		const takeaway = get(chartInfo, 'chart.takeaway', []);
		const date4 = moment(get(takeaway, "[0].date"));
		const newDataTakeaway = [...Array(Number(daysOnMonth))].map((item, i) => {
			const currentDay = moment(`${date4.year()}-${date.month() + 1}-${i + 1} 12:00:00`);
			const day = currentDay.dayOfYear();
			const hasDate = takeaway.find(j => Number(j.doy) === day);
			if (hasDate) {
				return hasDate;
			}
			return {
				count: get(item, "count", 0),
				date: get(item, "date", currentDay.format("YYYY-MM-DD HH:mm:ss")),
				doy: String(currentDay.dayOfYear())
			};
		});
		setDataTakeaway(newDataTakeaway);

	}, [])
	return (
		<div>
			{isFetched && (
				<div className="dashboard-chart">

					<div className="dashboard-chart__content">
						<div className="dashboard-chart__data">
							<div className="dashboard-chart__head">
								<h3>{t("Графика заказов на последний месяц")}</h3>
							</div>

							<Line data={dataLineChart} options={options} />
						</div>
						<div className="dashboard-chart__info">
							<div>
								<span className="desc-ui desc-ui--pink">{t("Собой")}</span>
								<span>{get(chartInfo, 'statistics.takeaway')} {t("шт")}</span>
							</div>
							<div>
								<span className="desc-ui desc-ui--blue">{t("На стол")}</span>
								<span>{get(chartInfo, 'statistics.on_table')} {t("шт")}</span>
							</div>
							<div>
								<span className="desc-ui desc-ui--green">{t("Доставка")}</span>
								<span>{get(chartInfo, 'statistics.delivery')} {t("шт")}</span>
							</div>
							<div>
								<span className="desc-ui desc-ui--yellow">{t("Бронирование")}</span>
								<span>{get(chartInfo, 'statistics.booking')} {t("шт")}</span>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default DashboardChart;
