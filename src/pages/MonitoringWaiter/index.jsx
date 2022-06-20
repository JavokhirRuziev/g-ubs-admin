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
	const { t } = useTranslation();
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
			url: queryBuilder(config.API_ROOT + `/dashboard/waiter-monitoring`, {
				extra: {
					percent: params.percent && params.percent,
					status: params.status && params.status,
					start_date: params.start_at && params.start_at,
					end_date: params.end_at && params.end_at,
					waiter_id: params.waiter_id && params.waiter_id.split('/')[0]
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
					url="/dashboard/waiter-monitoring"
					primaryKey={"id"}
					params={{
						limit: 300,
						page: page ? page : 1,
						extra: {
							percent: params.percent && params.percent,
							status: params.status && params.status,
							start_date: params.start_at && params.start_at,
							end_date: params.end_at && params.end_at,
							waiter_id: params.waiter_id && params.waiter_id.split('/')[0]
						}
					}}
				>
					{({ items, isFetched, meta }) => {
						const currentPage = get(meta, 'currentPage');
						const perPage = get(meta, 'perPage');

						const total = {
							uid: '001',
							name: 'Всего',
							total_price: items.reduce((prev,curr) => prev+curr.total_price, 0),
							tip_price: items.reduce((prev,curr) => prev+curr.tip_price, 0),
							is_total: true,
						}

						const newArr = items.length > 0 ? [...items, total] : [];
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
												title: "Названия",
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
												title: "Qilgan savdos",
												dataIndex: "total_price",
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
												title: "Xizmat haqi",
												dataIndex: "tip_price",
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
												title: "Ofitsant haqi",
												dataIndex: "total_sum",
												render: (value,row) => {
													const is_total = get(row, 'is_total');
													const sum = (row.total_price - row.tip_price)*params.percent/100
													return(
														<div className={is_total ? 'fw-700 fs-18 divider-wrapper' : 'divider-wrapper'}>
															{params.percent ? <div>{sum ? Number(sum).toLocaleString() : '-'}</div> : '-'}
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
													Отчёт
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