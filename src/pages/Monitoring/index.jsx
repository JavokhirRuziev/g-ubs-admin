import React, { useState } from "react";

import { Table, Board } from "components";
import { Pagination, Spin, Tag } from "antd";
import EntityContainer from "modules/entity/containers";
import { helpers, queryBuilder } from "services";
import Filter from "./Filter";
import MobFilter from "./MobFilter";
import qs from "query-string";

import { useTranslation } from "react-i18next";
import get from "lodash/get";
import "../Dashboard/style.scss";
import ExcelIcon from "assets/images/icons/excel-icon.svg"
import axios from "axios";
import config from "config"
import { useSelector } from "react-redux";

const Index = ({location, history}) => {
	const {t} = useTranslation("");
	const [filterModal, showFilterModal] = useState(false);
	const params = qs.parse(location.search, {ignoreQueryPrefix: true});
	const windowWidth = useSelector(state => state.system.width);

	const page = params.page;
	const setPage = (page) => {
		history.push({
			search: qs.stringify({...params, page}, {encode: false})
		})
	}

	const downloadReport = () => {
		// setSubmitting(true);
		axios({
			url: queryBuilder(config.API_ROOT + `/dashboard/report-monitoring`, {
				filter: {
					"orders.status": params.status
				},
				extra: {
					kitchener_id: params.kitchener_id && params.kitchener_id.split('/')[0],
					dish_id: params.dish_id && params.dish_id.split('/')[0],
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
				<div className="title-md">{t("Мониторинг")}</div>
			</div>

			<Board className="border-none mb-30">
				{(windowWidth > 1250) ? (
					<Filter/>
				) : (
					<MobFilter {...{filterModal, showFilterModal}}/>
				)}

				<EntityContainer.All
					entity="monitoring"
					name={`all`}
					url="/dashboard/monitoring"
					primaryKey={"uid"}
					params={{
						limit: 300,
						page: page ? page : 1,
						filter: {
							['orders.status']: params.status && params.status,
						},
						extra: {
							start_date: params.start_at && params.start_at,
							end_date: params.end_at && params.end_at,
							dish_id: params.dish_id && params.dish_id.split('/')[0],
							kitchener_id: params.kitchener_id && params.kitchener_id.split('/')[0]
						}
					}}
				>
					{({ items, isFetched, meta }) => {
						const currentPage = get(meta, 'currentPage');
						const perPage = get(meta, 'perPage');


						const withPrice = items.reduce((prev,curr) => [...prev, {
							...curr,
							price: (curr.amount * Number(curr.quantity)).toFixed(2)
						}], [])

						const total = {
							uid: '001',
							name: 'Всего',
							unit: " ",
							amount: " ",
							quantity: " ",
							price: withPrice.reduce((prev,curr) => prev + Number(curr.price), 0),
							is_total: true
						}

						const newArr = items.length > 0 ? [...withPrice, total] : [];
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
													const n = currentPage > 1 ? a+index+1 : index+1;
													const is_total = get(row, 'is_total');
													return (
														<div className="divider-wrapper">{is_total ? "" : n}</div>
													)
												}
											},
											{
												title: t("Названия"),
												dataIndex: "name",
												render: (value,row) => {
													const is_total = get(row, 'is_total');
													return(
														<div className={is_total ? 'fw-700 fs-18 divider-wrapper' : 'divider-wrapper'}>
															{value ? value : "-"}
														</div>
													)
												}
											},
											{
												title: t("Цена"),
												dataIndex: "amount",
												render: (value,row) => {
													const is_total = get(row, 'is_total');
													return(
														<div className={is_total ? 'fw-700 fs-18 divider-wrapper' : 'divider-wrapper'}>
															{value ? value.toLocaleString() : "-"}
														</div>
													)
												}
											},
											{
												title: t("Ед изм"),
												dataIndex: "unit",
												render: (value,row) => {
													const is_total = get(row, 'is_total');
													return(
														<div className={is_total ? 'fw-700 fs-18 divider-wrapper' : 'divider-wrapper'}>
															{value ? value : "-"}
														</div>
													)
												}
											},
											{
												title: t("Кол-во"),
												dataIndex: "quantity",
												render: (value,row) => {
													const is_total = get(row, 'is_total');
													return(
														<div className={is_total ? 'fw-700 fs-18 divider-wrapper' : 'divider-wrapper'}>
															{value ? value : "-"}
														</div>
													)
												}
											},
											{
												title: t("Сумм"),
												dataIndex: "price",
												render: (value,row) => {
													const is_total = get(row, 'is_total');
													return(
														<div className={is_total ? 'fw-700 fs-18 divider-wrapper' : 'divider-wrapper'}>
															{value ? value : "-"}
														</div>
													)
												}
											},
											{
												title: t("Статус"),
												dataIndex: "status",
												render: (value,row) => {
													const is_total = get(row, 'is_total');
													return(
														<div className={"divider-wrapper"}>
															{is_total ? (
																<div/>
															) : (
																<Tag
																	color={helpers.getOrderStatus(value).color}>{helpers.getOrderStatus(value).label}</Tag>
															)}
														</div>
													)
												}
											}
										]}
										dataSource={newArr}
									/>
								</div>
								{meta && meta.perPage && (
									<div className="pagination-foot-buttons">
										<div className="d-flex">
											<div className="download-excel-btn" onClick={downloadReport}>
												<img src={ExcelIcon} alt="" />
												<button>
													{t("Отчёт")}
												</button>
											</div>
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
		</>
	);
};

export default Index;