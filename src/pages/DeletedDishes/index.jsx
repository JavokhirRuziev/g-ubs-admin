import React, { useEffect, useState } from "react";

import { Table, Board } from "components";
import { Pagination, Spin, Tag } from "antd";
import { Avatar } from "components";
import EntityContainer from "modules/entity/containers";
import { helpers, queryBuilder } from "services";
import Filter from "./Filter";
import MobFilter from "./MobFilter";
import qs from "query-string";

import { useTranslation } from "react-i18next";
import get from "lodash/get";
import "../Dashboard/style.scss";
import ExcelIcon from "assets/images/icons/excel-icon.svg";
import axios from "axios";
import config from "config";
import { useSelector } from "react-redux";
import { dateFormatter } from "../../services/dateFormatter";

const Index = ({ location, history }) => {
	const { t } = useTranslation("main");
	const [filterModal, showFilterModal] = useState(false);
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const windowWidth = useSelector(state => state.system.width);

	const page = params.page;
	const setPage = page => {
		history.push({
			search: qs.stringify({ ...params, page }, { encode: false })
		});
	};

	const downloadReport = () => {
		// setSubmitting(true);
		axios({
			url: queryBuilder(
				config.API_ROOT + `/dashboard/report-waiter-monitoring`,
				{
					extra: {
						percent: params.percent && params.percent,
						status: params.status && params.status,
						start_date: params.start_at && params.start_at,
						end_date: params.end_at && params.end_at,
						waiter_id:
							params.waiter_id && params.waiter_id.split("/")[0]
					}
				}
			), //your url
			method: "GET",
			responseType: "blob" // important
		})
			.then(response => {
				const url = window.URL.createObjectURL(
					new Blob([response.data])
				);
				const link = document.createElement("a");
				link.href = url;
				link.setAttribute("download", "report.xlsx"); //or any other extension
				document.body.appendChild(link);
				link.click();
				// setSubmitting(false);
			})
			.catch(function(error) {
				// setSubmitting(false);
			});
	};

	return (
		<>
			<div className="d-flex justify-content-between align-items-center mb-20">
				<div className="title-md">{t("Мониторинг")}</div>
			</div>

			<Board className="border-none mb-30">
				{windowWidth > 1250 ? (
					<Filter />
				) : (
					<MobFilter {...{ filterModal, showFilterModal }} />
				)}

				<EntityContainer.All
					entity="deleted-dishes"
					name={`all`}
					url="/deleted-dishes"
					primaryKey={"id"}
					params={{
						limit: 300,
						page: page ? page : 1,
						extra: {
							percent: params.percent && params.percent,
							status: params.status && params.status,
							start_date: params.start_at && params.start_at,
							end_date: params.end_at && params.end_at,
							waiter_id:
								params.waiter_id &&
								params.waiter_id.split("/")[0],
							include: "dish.kitchener,manager"
						}
					}}>
					{({ items, isFetched, meta }) => {
						return (
							<Spin spinning={!isFetched}>
								<div className="default-table pad-15">
									<Table
										rowKey="id"
										columns={[
											{
												title: t("No"),
												dataIndex: ``,
												className: `text-align-left`,
												render: value => {
													return (
														<div className="divider-wrapper">
															{/* {items.findIndex(
																element =>
																	value ===
																	element.id
															) + 1} */}
															{console.log(value)}
														</div>
													);
												}
											},
											// {
											// 	title: t("Фото"),
											// 	dataIndex: "dish.file",
											// 	className: "w-82 text-cen",
											// 	render: value => (
											// 		<div className="divider-wrapper">
											// 			<Avatar
											// 				isRectangle
											// 				isProduct
											// 				image={get(
											// 					value,
											// 					"thumbnails.small.src"
											// 				)}
											// 			/>
											// 		</div>
											// 	)
											// },
											{
												title: t("Загаловок"),
												dataIndex:
													"dish.translate.name",
												render: value => (
													<div className="divider-wrapper">
														{value ? value : "-"}
													</div>
												)
											},
											{
												title: t("Цена"),
												dataIndex: "dish",
												render: value => (
													<div className="divider-wrapper">
														{value && value.price}
													</div>
												)
											},
											{
												title: t("Кол-во"),
												dataIndex: "",
												render: value => (
													<div className="divider-wrapper">
														{value &&
															value.quantity}{" "}
														{value &&
															value.dish.unit[
																`title_ru`
															]}
													</div>
												)
											},
											{
												title: t("Повар"),
												dataIndex: "dish.kitchener",
												render: value => (
													<div className="divider-wrapper">
														{value && value.name}
													</div>
												)
											},

											{
												title: t("Менежер"),
												dataIndex: "manager.name",
												render: value => (
													<div className="divider-wrapper">
														{value && value}
													</div>
												)
											},
											{
												title: t("Order Id"),
												dataIndex: "order_id",
												render: value => (
													<div className="divider-wrapper">
														{value && value}
													</div>
												)
											},
											{
												title: t("Дата"),
												dataIndex: "created_at",
												render: value => (
													<div className="divider-wrapper">
														{value &&
															dateFormatter(
																value
															)}
													</div>
												)
											}
										]}
										dataSource={items}
									/>
								</div>
								{meta && meta.perPage && (
									<div className="pagination-foot-buttons">
										{/* <div className="d-flex">
											<div
												className="download-excel-btn"
												onClick={downloadReport}>
												<img src={ExcelIcon} alt="" />
												<button>{t("Отчёт")}</button>
											</div>
										</div> */}
										<div
											style={{
												marginLeft: "auto"
											}}>
											<Pagination
												current={meta.currentPage}
												pageSize={meta.perPage}
												total={meta.totalCount}
												onChange={newPage =>
													setPage(newPage)
												}
											/>
										</div>
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
