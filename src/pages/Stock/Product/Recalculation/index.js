import React, { useState } from "react";
import { Table, Board, Panel } from "components";
import { Pagination, Spin, Tabs } from "antd";
import EntityContainer from "modules/entity/containers";

import { useTranslation } from "react-i18next";
import config from "config";
import qs from "query-string";
import useMediaQueries from "../../../../services/media-queries";
import { get } from "lodash";
import thousandsDivider from "../../../../services/thousandsDivider/thousandsDivider";
import Card from "../../../../components/Card/Card";
import { dateFormatter } from "../../../../services/dateFormatter";
import { Field, Formik } from "formik";
import { Fields } from "components";
import moment from "moment";

export default function index({ location, history }) {
	const TabPane = Tabs.TabPane;
	const [page, setPage] = useState(1);
	const query = qs.parse(location.search);
	const { lang } = query;
	const [tabLang, setTabLang] = useState(lang || "ru");
	const { mobile } = useMediaQueries();
	const { t } = useTranslation("main");
	const [search, setSearch] = useState({
		date_start: query.start_at ? moment.unix(query.start_at) : "",
		date_end: query.end_at ? moment.unix(query.end_at) : ""
	});

	const changeTab = value => {
		history.push(`/recalculation-products?lang=${value}`);
	};
	return (
		<>
			<div className="d-flex justify-content-between align-items-center mb-20">
				<div className="title-md">{t("Перерасчет продуктов")}</div>
			</div>
			<Board className="border-none">
				<div
					style={{
						padding: "10px",
						display: "flex",
						columnGap: "10px"
					}}>
					<Formik>
						<>
							<div>
								<Field
									component={Fields.AntDatePicker}
									name="start_at"
									size="large"
									placeholder={t("Дата начало")}
									style={{
										marginBottom: "0px",
										width: "190px"
									}}
									className={"mb-0"}
									showTime={{ format: "HH:mm" }}
									format="YYYY-MM-DD HH:mm"
									value={search.date_start}
									onChange={e => {
										if (moment(e).date()) {
											setSearch({
												...search,
												date_start: e
											});
											history.push(
												`/recalculation-products?start_at=${moment(
													e
												).unix()}`
											);
										} else {
											setSearch({
												...search,
												date_start: ""
											});
											history.push(
												`/recalculation-products?end_at=${search.date_end}`
											);
										}
									}}
								/>
							</div>
							<div>
								<Field
									component={Fields.AntDatePicker}
									name="end_at"
									size="large"
									placeholder={t("Дата окончание")}
									style={{
										marginBottom: "0px",
										width: "190px"
									}}
									className={"mb-0"}
									showTime={{ format: "HH:mm" }}
									format="YYYY-MM-DD HH:mm"
									value={search.date_end}
									onChange={e => {
										if (moment(e).date()) {
											setSearch({
												...search,
												date_end: e
											});
											history.push(
												`/recalculation-products?start_at=${moment(
													search.date_start
												).unix()}&end_at=${moment(
													e
												).unix()}`
											);
										} else {
											setSearch({
												...search,
												date_end: ""
											});
											history.push(
												`/recalculation-products?start_at=${moment(
													search.date_start
												).unix()}`
											);
										}
									}}
								/>
							</div>
						</>
					</Formik>
				</div>
			</Board>
			<Board className="border-none mt-90">
				<div style={{ position: "relative" }}>
					<Panel className="pad-0 mb-30">
						<Tabs
							activeKey={tabLang}
							onChange={value => {
								setTabLang(value);
								changeTab(value);
							}}
							tabBarStyle={{
								marginBottom: "0"
							}}>
							{config.API_LANGUAGES.map(item => (
								<TabPane key={item.code} tab={t(item.title)} />
							))}
						</Tabs>
					</Panel>
				</div>
				<EntityContainer.All
					entity="recalculation-products"
					name={`all`}
					url="/recalculation-products"
					params={{
						include: "product.translate,product.unit,user",
						extra: {
							_l: tabLang,
							start_date: query.start_at ? query.start_at : "",
							end_date: query.end_at ? query.end_at : ""
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
													dataIndex:
														"product.translate.name",
													render: value => (
														<div className="divider-wrapper">
															{value}
														</div>
													)
												},
												{
													title: t("Ползователь"),
													dataIndex: "user.name",
													render: value => (
														<div className="divider-wrapper">
															{value}
														</div>
													)
												},
												{
													title: t("Кол-во старое"),
													dataIndex: "",
													render: value => (
														<div className="divider-wrapper">
															{thousandsDivider(
																Number.parseFloat(
																	value.old_count
																)
															)}{" "}
															{value &&
																value.product &&
																value.product
																	.unit[
																	`title_${tabLang}`
																]}
														</div>
													)
												},
												{
													title: t("Кол-во новое"),
													dataIndex: "",
													render: value => {
														return (
															<div className="divider-wrapper">
																{thousandsDivider(
																	Number.parseFloat(
																		value.new_count
																	)
																)}{" "}
																{
																	value
																		.product
																		.unit[
																		`title_${tabLang}`
																	]
																}
															</div>
														);
													}
												},
												{
													title: t("Сумма"),
													dataIndex: "amount",
													render: value => {
														return (
															<div className="divider-wrapper">
																{thousandsDivider(
																	Number.parseFloat(
																		value
																	)
																)}
															</div>
														);
													}
												},
												{
													title: t("Дата"),
													dataIndex: "created_at",
													render: value => {
														return (
															<div className="divider-wrapper">
																{dateFormatter(
																	value
																)}
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
																		"Кол-во старое"
																	),
																	name: (
																		<div className="divider-wrapper">
																			{item &&
																				thousandsDivider(
																					Number.parseFloat(
																						item.old_count
																					)
																				)}{" "}
																			{item &&
																				item.product &&
																				item
																					.product
																					.unit[
																					`title_${tabLang}`
																				]}
																		</div>
																	)
																},
																{
																	title: t(
																		"Кол-во новое"
																	),
																	name: (
																		<div className="divider-wrapper">
																			{item &&
																				thousandsDivider(
																					Number.parseFloat(
																						item.new_count
																					)
																				)}{" "}
																			{item &&
																				item
																					.product
																					.unit[
																					`title_${tabLang}`
																				]}
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
