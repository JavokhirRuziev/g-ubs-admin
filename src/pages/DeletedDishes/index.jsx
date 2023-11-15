import React, { useState } from "react";

import { Table, Board } from "components";
import { Pagination, Spin, Tag } from "antd";
import EntityContainer from "modules/entity/containers";
import { queryBuilder } from "services";
import Filter from "./Filter";
import MobFilter from "./MobFilter";
import qs from "query-string";

import { useTranslation } from "react-i18next";
import "../Dashboard/style.scss";
import axios from "axios";
import config from "config";
import { useSelector } from "react-redux";
import { dateFormatter } from "../../services/dateFormatter";
import thousandsDivider from "../../services/thousandsDivider/thousandsDivider";

const Index = ({ location, history }) => {
	const { t } = useTranslation("main");
	const [filterModal, showFilterModal] = useState(false);
	const [amount, setAmount] = useState();
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const windowWidth = useSelector(state => state.system.width);

	const page = params.page;
	const setPage = page => {
		history.push({
			search: qs.stringify({ ...params, page }, { encode: false })
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
				<div style={{ position: "relative" }}>
					<p
						style={{
							position: "absolute",
							top: -20,
							right: 20,
							fontSize: "32px",
							fontWeight: "bold"
						}}>
						{thousandsDivider(amount)} {t("сум")}
					</p>
				</div>
				<EntityContainer.All
					entity="deleted-dishes"
					name={`all`}
					url="/deleted-dishes"
					primaryKey={"id"}
					onSuccess={data => {
						const sum = data.data.reduce(
							(total, el) => el.price * el.quantity + total,
							0
						);
						setAmount(sum);
					}}
					params={{
						limit: 300,
						page: page ? page : 1,
						extra: {
							kitchener_id:
								params.kitchener &&
								params.kitchener.split("/")[0],
							manager_id:
								params.cashier && params.cashier.split("/")[0],
							start_date: params.start_at && params.start_at,
							end_date: params.end_at && params.end_at,
							waiter_id:
								params.waiter_id &&
								params.waiter_id.split("/")[0],
							include:
								"dish.kitchener,manager,order,order.booking.table",
							table_number:
								params.table_number && params.table_number,
							search: params.order_number && params.order_number,
							dish_id:
								params.dish_id && params.dish_id.split("/")[0],
							quantity: params.quantity && params.quantity
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
												dataIndex: `id`,
												className: `text-align-left w-82`,
												render: value => {
													return (
														<div className="divider-wrapper">
															{items.findIndex(
																element =>
																	value ===
																	element.id
															) + 1}
														</div>
													);
												}
											},
											{
												title: t("Номер заказа"),
												dataIndex: "order.order_number",
												className: "w-82",
												render: value => (
													<div className="divider-wrapper">
														{value ? value : "-"}
													</div>
												)
											},
											{
												title: t("Номер стола"),
												dataIndex:
													"order.booking.table.number",
												className: "w-82",
												render: value => (
													<div className="divider-wrapper">
														{value ? value : "-"}
													</div>
												)
											},
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
												title: t("Повор"),
												dataIndex: "dish.kitchener",
												render: value => (
													<div className="divider-wrapper">
														{value && value.name}
													</div>
												)
											},

											{
												title: t("Менеджер"),
												dataIndex: "manager.name",
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
