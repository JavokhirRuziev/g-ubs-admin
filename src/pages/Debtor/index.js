import React, { useState } from "react";
import { Table, Board } from "components";
import { Pagination, Spin } from "antd";
import EntityContainer from "modules/entity/containers";

import { useTranslation } from "react-i18next";
import qs from "query-string";
import useMediaQueries from "../../services/media-queries";
import { get } from "lodash";
import thousandsDivider from "../../services/thousandsDivider/thousandsDivider";
import Card from "../../components/Card/Card";

export default function index({ location }) {
	const [page, setPage] = useState(1);
	const query = qs.parse(location.search);
	const { mobile } = useMediaQueries();
	const { t } = useTranslation("main");

	return (
		<>
			<div className="d-flex justify-content-between align-items-center mb-20">
				<div className="title-md">{t("Дебиторка")}</div>
			</div>

			<Board className="border-none mt-90">
				<EntityContainer.All
					entity="statistics/creditor-data"
					name={`all`}
					url="/statistics/creditor-data"
					params={{
						extra: {
							start_date: query.start_at ? query.start_at : "",
							end_date: query.end_at ? query.end_at : "",
							alias: query.alias && query.alias
						},
						page
					}}>
					{({ items, isFetched, meta }) => {
						return (
							<Spin spinning={!isFetched}>
								{!mobile ? (
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
													title: t("Название"),
													dataIndex: "title",
													render: value => (
														<div className="divider-wrapper">
															{value}
														</div>
													)
												},
												{
													title: t("Ползователь"),
													dataIndex: "customer.name",
													render: value => (
														<div className="divider-wrapper">
															{value}
														</div>
													)
												},
												{
													title: t("Номер телефона"),
													dataIndex: "customer.phone",
													render: value => (
														<div className="divider-wrapper">
															{value}
														</div>
													)
												},
												{
													title: t("Сумма"),
													dataIndex: "sum",
													render: value => {
														return (
															<div className="divider-wrapper">
																{thousandsDivider(
																	Number.parseFloat(
																		value
																	)
																)}{" "}
																{t("сум")}
															</div>
														);
													}
												}
											]}
											dataSource={items}
										/>
									</div>
								) : (
									<div
										style={{
											display: "flex",
											flexWrap: "wrap",
											columnGap: "10px",
											rowGap: "10px",
											justifyContent: "center",
											alignItems: "center",
											marginTop: "20px"
										}}>
										{items &&
											items.map((item, index) => {
												return (
													<Card
														{...{
															content: [
																{
																	title: t(
																		"No"
																	),
																	name: (
																		<div className="divider-wrapper">
																			{items.findIndex(
																				element =>
																					item.id ===
																					element.id
																			) +
																				1}
																		</div>
																	)
																},

																{
																	title: t(
																		"Название"
																	),

																	name: (
																		<div className="divider-wrapper">
																			{get(
																				item,
																				"product.translate.name"
																			)}
																		</div>
																	)
																},
																{
																	title: t(
																		"Ползователь"
																	),

																	name: (
																		<div className="divider-wrapper">
																			{get(
																				item,
																				"user.name"
																			)}
																		</div>
																	)
																},
																{
																	title: t(
																		"Сумма"
																	),

																	name: (
																		<div className="divider-wrapper">
																			{thousandsDivider(
																				Number.parseFloat(
																					get(
																						item,
																						"amount"
																					)
																				)
																			)}
																		</div>
																	)
																}
															]
														}}
													/>
												);
											})}
									</div>
								)}
								{meta && meta.perPage && (
									<div className="pad-15 d-flex justify-content-end">
										<Pagination
											current={meta.currentPage}
											pageSize={meta.perPage}
											total={meta.totalCount}
											onChange={newPage =>
												setPage(newPage)
											}
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
}
