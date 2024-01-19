import React, { useEffect, useState } from "react";
import { Table, Board, Panel } from "components";
import { Button, Pagination, Spin, Modal, notification, Tabs } from "antd";
import EntityContainer from "modules/entity/containers";
import Create from "./components/Create";
import Update from "./components/Update";
import Actions from "modules/entity/actions";

import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import config from "config";
import qs from "query-string";
import useMediaQueries from "../../../services/media-queries";
import { get } from "lodash";
import Card from "../../../components/Card/Card";
import thousandsDivider from "../../../services/thousandsDivider/thousandsDivider";
import { dateFormatter } from "../../../services/dateFormatter";
import Download from "./components/Download";
import { Field, Formik } from "formik";
import { Fields } from "components";

const colors = [
	{ name: "Критическое", value: "red" },
	{ name: "Нормальное", value: "yellow" },
	{ name: "Достаточное", value: "green" }
];

export default function index({ location, history, match }) {
	const TabPane = Tabs.TabPane;
	const [createModal, showCreateModal] = useState(false);
	const [recalculation, showRecalculation] = useState(false);
	const [updateModal, showUpdateModal] = useState(false);
	const [selected, setSelected] = useState(null);
	const [page, setPage] = useState(1);
	const query = qs.parse(location.search);
	const { lang } = query;
	const [tabLang, setTabLang] = useState(lang || "ru");
	const { id } = match.params;
	const { mobile } = useMediaQueries();
	const { t } = useTranslation("main");
	const dispatch = useDispatch();
	const [download, showDownload] = useState();

	const changeTab = value => {
		history.push(`/agreement?lang=${value}`);
	};

	const openEditModal = value => {
		setSelected(value);
		showUpdateModal(true);
	};
	const openDownload = value => {
		setSelected(value);
		showDownload(true);
	};

	const onDeleteHandler = id => {
		Modal.confirm({
			title: t("Вы действительно хотите удалить?"),
			okText: t("да"),
			okType: "danger",
			cancelText: t("нет"),
			confirmLoading: true,
			onOk: () => deleteAction(id)
		});
	};

	const deleteAction = id => {
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "contracts",
				name: `all`,
				id: id,
				url: `/contracts/${id}`,
				deleteData: true,
				cb: {
					success: () => {
						notification["success"]({
							message: t("Успешно удалена"),
							duration: 2
						});
						// window.location.reload();
					},
					error: () => {
						notification["error"]({
							message: t("Что-то пошло не так"),
							duration: 2
						});
					},
					finally: () => {}
				}
			})
		);
	};

	return (
		<>
			<div className="d-flex justify-content-between align-items-center mb-20">
				<div className="title-md">{t("Договора")}</div>
			</div>
			<Modal
				visible={createModal}
				onOk={() => showCreateModal(true)}
				onCancel={() => showCreateModal(false)}
				footer={null}
				centered
				width={430}
				destroyOnClose>
				<Create {...{ showCreateModal, tabLang }} />
			</Modal>
			<Modal
				visible={updateModal}
				onOk={() => showUpdateModal(true)}
				onCancel={() => showUpdateModal(false)}
				footer={null}
				centered
				width={430}
				destroyOnClose>
				<Update {...{ selected, showUpdateModal, tabLang, id }} />
			</Modal>
			<Modal
				visible={download}
				onOk={() => showDownload(true)}
				onCancel={() => showDownload(false)}
				footer={null}
				centered
				width={430}
				destroyOnClose>
				<Download {...{ selected, showDownload }} />
			</Modal>
			<Board className="mb-40 mt-20">
				<div className="d-flex justify-content-between align-items-center pad-10">
					<div
						style={{
							display: "flex",
							columnGap: "10px",
							rowGap: "10px",
							flexWrap: "wrap",
							alignItems: "center"
						}}></div>
					<div>
						<Button
							type="primary"
							size="large"
							className="fs-14 fw-300 ml-10"
							htmlType="button"
							onClick={() => showCreateModal(true)}>
							{t("Добавить")}
						</Button>
					</div>
				</div>
			</Board>
			<Board className="border-none">
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
					entity="contracts"
					name={`all`}
					url="/contracts"
					params={{
						extra: {
							_l: tabLang,
							include: "client_company"
						},
						page
					}}>
					{({ items, isFetched, meta }) => {
						return (
							<Spin spinning={!isFetched}>
								{!mobile ? (
									<div className="default-table pad-15">
										<Table
											hasEdit={true}
											hasDelete={true}
											hasDishesProduct={true}
											rowKey="id"
											onEdit={value => {
												openEditModal(value);
											}}
											onDelete={value =>
												onDeleteHandler(value.id)
											}
											onReadyProd={value =>
												openDownload(value)
											}
											columns={[
												{
													title: t("No"),
													dataIndex: `id`,
													className:
														"text-align-left w-82",
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
													title: t("Имя"),
													dataIndex: "client_name",
													render: value => (
														<div className="divider-wrapper">
															{value}
														</div>
													)
												},
												{
													title: t("ИНН"),
													dataIndex: "tin",
													render: value => (
														<div className="divider-wrapper">
															{value}
														</div>
													)
												},
												{
													title: t("Адрес"),
													dataIndex: "client_address",
													render: value => (
														<div className="divider-wrapper">
															{value}
														</div>
													)
												},
												{
													title: t("Телефон"),
													dataIndex: "client_phone",
													render: value => (
														<div className="divider-wrapper">
															{value}
														</div>
													)
												},
												{
													title: t("Дата"),
													dataIndex: `created_at`,
													render: value => (
														<div className="divider-wrapper">
															{dateFormatter(
																value
															)}
														</div>
													)
												},
												{
													title: t("Банк"),
													dataIndex: `bank`,
													render: value => (
														<div className="divider-wrapper">
															{value}
														</div>
													)
												},
												{
													title: t("Статус"),
													dataIndex: "is_active",
													render: value => (
														<div className="divider-wrapper">
															<div
																className="color-view-ellipse"
																style={{
																	backgroundColor: value
																		? "#4caf50"
																		: "#f44336"
																}}
															/>
														</div>
													)
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
															hasDelete: true,
															hasEdit: true,
															hasDishesProduct: true,
															onReadyProd: () => {
																setSelected(
																	item
																);
																showRecalculation(
																	true
																);
															},
															onEdit: () => {
																openEditModal(
																	item
																);
															},
															onDelete: () =>
																onDeleteHandler(
																	item.id
																),
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
																				"translate.name"
																			)}
																		</div>
																	)
																},
																{
																	title: t(
																		"Остаток"
																	),
																	name: (
																		<div className="divider-wrapper">
																			{thousandsDivider(
																				get(
																					item,
																					"amount"
																				)
																			)}
																		</div>
																	)
																},
																{
																	title: t(
																		"Количество"
																	),
																	name: (
																		<div className="divider-wrapper">
																			<div
																				style={{
																					background:
																						Number.parseFloat(
																							get(
																								item,
																								"count"
																							)
																						) <=
																						Number.parseFloat(
																							get(
																								item,
																								"deficit_threshold"
																							)
																						)
																							? "rgba(255,0,0,1.7)"
																							: Number.parseFloat(
																									get(
																										item,
																										"count"
																									)
																							  ) >=
																									Number.parseFloat(
																										get(
																											item,
																											"deficit_threshold"
																										)
																									) &&
																							  Number.parseFloat(
																									get(
																										item,
																										"count"
																									)
																							  ) <=
																									Number.parseFloat(
																										get(
																											item,
																											"average_quantity"
																										)
																									)
																							? "rgba(255,200,0,1.7)"
																							: get(
																									item,
																									"count"
																							  ) >=
																							  Number.parseFloat(
																									get(
																										item,
																										"average_quantity"
																									)
																							  )
																							? "rgba(0,255,0,1.7)"
																							: "#fff",
																					color:
																						"black",
																					fontWeight:
																						"700",
																					padding:
																						"5px",
																					fontSize:
																						"16px"
																				}}>
																				{thousandsDivider(
																					get(
																						item,
																						"count"
																					)
																				)}{" "}
																				{
																					get(
																						item,
																						`unit`
																					)[
																						`title_${tabLang}`
																					]
																				}
																			</div>
																		</div>
																	)
																},
																{
																	title: t(
																		"Склад"
																	),
																	name: (
																		<div className="divider-wrapper">
																			{get(
																				item,
																				"stock.translate.name"
																			)}
																		</div>
																	)
																},
																{
																	title: t(
																		"Категория"
																	),
																	name: (
																		<div className="divider-wrapper">
																			{get(
																				item,
																				"category.translate.name"
																			)}
																		</div>
																	)
																},
																{
																	title: t(
																		"Статус"
																	),
																	name: (
																		<div className="divider-wrapper">
																			<div
																				className="color-view-ellipse"
																				style={{
																					backgroundColor: Boolean(
																						get(
																							item,
																							"is_active"
																						)
																					)
																						? "#4caf50"
																						: "#f44336"
																				}}
																			/>
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
