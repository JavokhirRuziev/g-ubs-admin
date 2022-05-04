import React, { useEffect, useState } from "react";

import { Table, Board } from "components";
import { Pagination, Spin, Tag } from "antd";
import EntityContainer from "modules/entity/containers";
import { helpers, queryBuilder } from "services";
import Filter from "./Filter";
import qs from "query-string";

import { useTranslation } from "react-i18next";
import get from "lodash/get";
import variables from "../../variables";
import "../Dashboard/style.scss";
import { useDispatch } from "react-redux";
import Actions from "../../modules/entity/actions";
import ExcelIcon from "assets/images/icons/excel-icon.svg"
import axios from "axios";
import config from "config"

const Index = ({location, history}) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const [statistic, setStatistic] = useState([]);
	const params = qs.parse(location.search, {ignoreQueryPrefix: true});

	const page = params.page;
	const setPage = (page) => {
		history.push({
			search: qs.stringify({...params, page}, {encode: false})
		})
	}

	useEffect(() => {
		dispatch(Actions.LoadDefault.request({
			url: '/dashboard/payment-reports',
			params: {
				filter: {
					'orders.status': params.status && params.status,
					'orders.type': params.type && params.type,
				},
				extra: {
					start_date: params.start_at && params.start_at,
					end_date: params.end_at && params.end_at
				}
			},
			cb: {
				success: (data) => {
					setStatistic(data)
				},
				error: () => {},
			}
		}))
	}, [params.type, params.status, params.start_at, params.end_at])


	const cash = statistic.find(a => a.payment_type === 1);
	const payme = statistic.find(a => a.payment_type === 2);
	const click = statistic.find(a => a.payment_type === 3);
	const terminal = statistic.find(a => a.payment_type === 4);

	const downloadReport = () => {
		// setSubmitting(true);
		axios({
			url: queryBuilder(config.API_ROOT + `/dashboard/report`, {
				filter: {
					"orders.type": params.type,
					"orders.status": params.status
				},
				extra: {
					start_date: params.start_at,
					end_date: params.end_at,

				}
			}), //your url
			method: 'GET',
			responseType: 'blob', // important
		}).then((response) => {
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', 'report.xlsx'); //or any other extension
			document.body.appendChild(link);
			link.click();
			// setSubmitting(false);
		}).catch(function (error) {
			// setSubmitting(false);
		});
	};

	return (
		<>
			<div className="d-flex justify-content-between align-items-center mb-20">
				<div className="title-md">{t("Заказы")}</div>
			</div>

			<Board className="border-none mb-30">
				<Filter/>

				<EntityContainer.All
					entity="order"
					name={`all`}
					url="/dashboard/orders"
					params={{
						limit: 100,
						include: "user,waiter,payments",
						page: page ? page : 1,
						filter: {
							status: params.status && params.status,
							type: params.type && params.type,
							order_number: params.order_number && params.order_number
						},
						extra: {
							start_date: params.start_at && params.start_at,
							end_date: params.end_at && params.end_at,
							dish_id: params.dish_id && params.dish_id.split('/')[0]
						}
					}}
				>
					{({ items, isFetched, meta }) => {
						const currentPage = get(meta, 'currentPage');
						const perPage = get(meta, 'perPage');
						return (
							<Spin spinning={!isFetched}>
								<div className="default-table pad-15">
									<Table
										rowKey="id"
										columns={[
											{
												title: "№",
												className: "w-100",
												render: (value,row,index) => {
													const a = Number(currentPage-1)*Number(perPage);
													const n = currentPage > 1 ? a+index+1 : index+1
													return (
														<div className="divider-wrapper">{n}</div>
													)
												}
											},
											{
												title: "Номер заказа",
												dataIndex: "order_number",
												className: "w-100",
												render: value => <div className="divider-wrapper">{value}</div>
											},
											{
												title: "Дата",
												dataIndex: "created_at",
												className: "",
												render: value => <div className="divider-wrapper">
													{helpers.formatDate(value, "HH:mm / DD.MM.YYYY")}
												</div>
											},
											{
												title: "Тип",
												dataIndex: "type",
												className: "",
												render: value => <div className="divider-wrapper">
													{helpers.getOrderType(value)}
												</div>
											},
											{
												title: "Официант",
												dataIndex: "waiter",
												className: "",
												render: value => <div className="divider-wrapper">
													{value ? get(value, 'to_user.name') : '-'}
												</div>
											},
											{
												title: "Клиент",
												dataIndex: "user",
												className: "",
												render: value => <div className="divider-wrapper">
													{get(value, "phone")}
												</div>
											},
											{
												title: "Цена доставки",
												dataIndex: "delivery_price",
												className: "",
												render: (value,row) => <div className="divider-wrapper">
													{row.type === variables.TYPE_DELIVERY ? <span>{value ? value.toLocaleString() : '-'}</span> : '-'}
												</div>
											},
											{
												title: "Цена обслуги",
												dataIndex: "tip_price",
												className: "",
												render: (value) => <div className="divider-wrapper">
													<span>{value ? value.toLocaleString() : '-'}</span>
												</div>
											},
											{
												title: "Тип оплаты",
												dataIndex: "payments",
												className: "",
												render: value => <div className="divider-wrapper">
													{(Array.isArray(value) && value.length > 0) ? (
														value.map(v => (
															<div className="d-flex">
																<span>{helpers.getPaymentType(v.payment_type)}</span>
																<span className="ml-10" style={{opacity: '.6'}}>{v.amount.toLocaleString()}</span>
															</div>
														))
													) : '-'}
												</div>
											},
											{
												title: "Цена",
												dataIndex: "total_sum",
												className: "",
												render: value => <div className="divider-wrapper">
													{value ? value.toLocaleString() : "-"}
												</div>
											},
											{
												title: "Статус",
												dataIndex: "status",
												className: "",
												render: value => <div className="divider-wrapper">
													<Tag
														color={helpers.getOrderStatus(value).color}>{helpers.getOrderStatus(value).label}</Tag>
												</div>
											}
										]}
										dataSource={items}
									/>
								</div>
								{meta && meta.perPage && (
									<div className="pad-15 d-flex justify-content-between align-items-center">
										<div className="download-excel-btn" onClick={downloadReport}>
											<img src={ExcelIcon} alt="" />
											<button>
												Скачать excel
											</button>
										</div>
										<Pagination
											current={meta.currentPage}
											pageSize={meta.perPage}
											total={meta.totalCount}
											onChange={newPage => setPage(newPage)}
										/>
									</div>
								)}
							</Spin>
						);
					}}
				</EntityContainer.All>
			</Board>

			<div className="row mb-30">
				<div className="col-3">
					<div className="dashboard-card">
						<div>
							<div className="dashboard-card__label">Наличние</div>
							<div className="dashboard-card__num">
								<span>{cash ? cash.amount.toLocaleString() : 0}</span>
								<span>сум</span>
							</div>
						</div>
						<div>
							<img src={require("../Dashboard/dashboard-icon.svg")} alt="" />
						</div>
					</div>
				</div>
				<div className="col-3">
					<div className="dashboard-card">
						<div>
							<div className="dashboard-card__label">Payme</div>
							<div className="dashboard-card__num">
								<span>{payme ? payme.amount.toLocaleString() : 0}</span>
								<span>сум</span>
							</div>
						</div>
						<div>
							<img src={require("../Dashboard/dashboard-icon.svg")} alt="" />
						</div>
					</div>
				</div>
				<div className="col-3">
					<div className="dashboard-card">
						<div>
							<div className="dashboard-card__label">Click</div>
							<div className="dashboard-card__num">
								<span>{click ? click.amount.toLocaleString() : 0}</span>
								<span>сум</span>
							</div>
						</div>
						<div>
							<img src={require("../Dashboard/dashboard-icon.svg")} alt="" />
						</div>
					</div>
				</div>
				<div className="col-3">
					<div className="dashboard-card">
						<div>
							<div className="dashboard-card__label">Терминал</div>
							<div className="dashboard-card__num">
								<span>{terminal ? terminal.amount.toLocaleString() : 0}</span>
								<span>сум</span>
							</div>
						</div>
						<div>
							<img src={require("../Dashboard/dashboard-icon.svg")} alt="" />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Index;