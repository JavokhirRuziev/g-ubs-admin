import React, { useEffect, useState } from "react";

import { Table, Board, Avatar } from "components";
import {
	Button,
	Pagination,
	Spin,
	Tabs,
	Modal,
	notification,
	Select
} from "antd";
import EntityContainer from "modules/entity/containers";
import Actions from "modules/entity/actions";

import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Field, Formik } from "formik";
import { Fields } from "components";

import config from "config";
import qs from "query-string";
import get from "lodash/get";
import Card from "../../components/Card/Card";
import useMediaQueries from "../../services/media-queries";
import axios from "axios";
import thousandsDivider from "../../services/thousandsDivider/thousandsDivider";

const List = ({ history, location }) => {
	const { mobile } = useMediaQueries();
	const query = qs.parse(location.search);
	const { lang } = query;

	const [search, setSearch] = useState({
		search: "",
		kitchener_id: query.kitchener_id || ""
	});
	const [tabLang, setTabLang] = useState(lang ? lang : "ru");
	const [page, setPage] = useState(1);

	const { t } = useTranslation("main");
	const dispatch = useDispatch();

	const handleChange = e => {
		setSearch({ ...search, search: e.target.value });
	};

	const onDeleteHandler = menuId => {
		Modal.confirm({
			title: t("Вы действительно хотите удалить?"),
			okText: t("да"),
			okType: "danger",
			cancelText: t("нет"),
			confirmLoading: true,
			onOk: () => deleteAction(menuId)
		});
	};
	const deleteAction = id => {
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "finished-dishes",
				name: `all-${tabLang}`,
				id: id,
				url: `/finished-dishes/${id}`,
				deleteData: true,
				primaryKey: "id",
				params: {
					extra: { _l: tabLang }
				},
				cb: {
					success: () => {
						notification["success"]({
							message: t("Успешно удалена"),
							duration: 2
						});
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

	const quickUpdateStatus = (id, value) => {
		dispatch(
			Actions.Form.request({
				method: "put",
				entity: "finished-dishes",
				name: `all-${tabLang}`,
				id: id,
				url: `/finished-dishes/quick-update/${id}`,
				primaryKey: "id",
				updateData: true,
				normalizeData: data => data,
				params: {
					extra: { _l: tabLang }
				},
				values: {
					status: value === 1 ? 0 : 1
				},
				cb: {
					success: () => {
						notification["success"]({
							message: t("Успешно обновлено"),
							duration: 2
						});
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

	const quickUpdateCountable = (id, value) => {
		dispatch(
			Actions.Form.request({
				method: "put",
				entity: "finished-dishes",
				name: `all-${tabLang}`,
				id: id,
				url: `/finished-dishes/quick-update/${id}`,
				primaryKey: "id",
				updateData: true,
				normalizeData: data => data,
				params: {
					extra: { _l: tabLang }
				},
				values: {
					countable: value === 1 ? 0 : 1
				},
				cb: {
					success: () => {
						notification["success"]({
							message: t("Успешно обновлено"),
							duration: 2
						});
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

	const TabPane = Tabs.TabPane;
	return (
		<>
			<div className="title-md">{t("Готовый продукт")}</div>
			<Board className="mb-40 mt-20">
				<div className="d-flex justify-content-between align-items-center pad-10">
					<div
						style={{
							display: "flex",
							columnGap: "10px",
							rowGap: "10px",
							flexWrap: "wrap"
						}}>
						<Formik
							initialValues={{
								kitchener: query.kitchener_name
									? { name: query.kitchener_name }
									: ""
							}}>
							{({ values }) => (
								<>
									<div>
										<Field
											component={Fields.AntInput}
											name="name"
											type="text"
											placeholder={t("Поиск")}
											size="large"
											onChange={handleChange}
											value={search.search}
											style={{
												marginBottom: "0px"
											}}
										/>
									</div>
									<div style={{ width: "190px" }}>
										<Field
											component={Fields.AsyncSelect}
											name="kitchener"
											placeholder={t("Повор")}
											isClearable
											loadOptionsUrl="/user"
											optionLabel={option =>
												get(option, `name`)
											}
											style={{
												marginBottom: "0px"
											}}
											onChange={value => {
												setSearch({
													...search,
													kitchener_id: get(
														value,
														"id"
													)
												});
											}}
											loadOptionsParams={search => {
												return {
													filter: {
														["role.role"]:
															"kitchener"
													},
													search
												};
											}}
										/>
									</div>
								</>
							)}
						</Formik>
					</div>
					<div
						style={{
							display: "flex",
							flexWrap: "wrap",
							columnGap: "10px",
							rowGap: "10px"
						}}>
						<Button
							type="primary"
							size="large"
							className="fs-14 fw-300 ml-10"
							htmlType="button"
							onClick={() =>
								history.push(`/recalculation-finished-dishes`)
							}>
							{t("Перерасчет")}
						</Button>
						<Button
							type="primary"
							size="large"
							className="fs-14 fw-300 ml-10"
							htmlType="button"
							onClick={() =>
								history.push(
									`/finished-dishes/create?lang=${tabLang}`
								)
							}>
							{t("Добавить")}
						</Button>
					</div>
				</div>
			</Board>
			<Board className="border-none">
				<div>
					<Tabs
						activeKey={tabLang}
						onChange={value => setTabLang(value)}
						className="tabs--board-head">
						{config.API_LANGUAGES.map(item => (
							<TabPane key={item.code} tab={t(item.title)} />
						))}
					</Tabs>
				</div>
				<EntityContainer.All
					entity="finished-dishes"
					name={`all-${tabLang}`}
					url="/finished-dishes"
					primaryKey="id"
					params={{
						sort: "-id",
						limit: 50,
						include: "translate,file,unit",
						extra: {
							_l: tabLang,
							search: search.search,
							kitchener_id: search.kitchener_id
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
											rowKey="id"
											hasDishesProduct={true}
											onReadyProd={value =>
												history.push(
													`/finished-product-update/${value.id}?lang=${tabLang}&quantity=${value.quantity}`
												)
											}
											onEdit={value =>
												history.push(
													`/finished-dishes/update/${value.id}?lang=${tabLang}`
												)
											}
											onDelete={value =>
												onDeleteHandler(value.id)
											}
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
													title: t("Фото"),
													dataIndex: "file",
													className: "w-82 text-cen",
													render: value => (
														<div className="divider-wrapper">
															<Avatar
																isRectangle
																isProduct
																image={get(
																	value,
																	"thumbnails.small.src"
																)}
															/>
														</div>
													)
												},
												{
													title: t("Загаловок"),
													dataIndex: "translate.name",
													render: value => (
														<div className="divider-wrapper">
															{value
																? value
																: "-"}
														</div>
													)
												},
												{
													title: t("Цена"),
													dataIndex: "price",
													render: value => (
														<div className="divider-wrapper">
															{value &&
																thousandsDivider(
																	value
																)}
														</div>
													)
												},
												{
													title: t("Себестоимость"),
													dataIndex: "cost_price",
													render: value => (
														<div className="divider-wrapper">
															{thousandsDivider(
																value
															)}
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
															{
																value.unit[
																	`title_${tabLang}`
																]
															}
														</div>
													)
												},
												{
													title: t("Сумма"),
													dataIndex: "",
													render: value => (
														<div className="divider-wrapper">
															{value &&
																value.cost_price &&
																value &&
																value.quantity &&
																thousandsDivider(
																	Number(
																		value.cost_price
																	) *
																		Number(
																			value.quantity
																		)
																)}{" "}
															{t("сум")}
															{}
														</div>
													)
												},
												{
													title: t("Статус"),
													dataIndex: "status",
													className: "text-cen w-82",
													render: (value, values) => {
														return (
															<div className="divider-wrapper">
																<div
																	className="color-view-ellipse m-0-auto cursor-pointer"
																	onClick={() =>
																		quickUpdateStatus(
																			values.id,
																			value
																		)
																	}
																	style={{
																		backgroundColor:
																			value ===
																			1
																				? "#4caf50"
																				: "#f44336"
																	}}
																/>
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
															hasEdit: true,
															hasDelete: true,
															hasDishesProduct: true,
															onReadyProd: () =>
																history.push(
																	`/finished-product-update/${item.id}?lang=${tabLang}&quantity=${item.quantity}`
																),
															onEdit: () =>
																history.push(
																	`/finished-dishes/update/${item.id}?lang=${tabLang}`
																),
															onDelete: () =>
																onDeleteHandler(
																	item.id
																),
															imgTiny: get(
																item,
																"file.thumbnails.small.src"
															),
															img: get(
																item,
																"file.thumbnails.small.src"
															),
															title: get(
																item,
																"translate.name"
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
																		"Себестоимость"
																	),
																	name: thousandsDivider(
																		get(
																			item,
																			"cost_price"
																		)
																	)
																},
																{
																	title: t(
																		"Ед изм"
																	),
																	name: get(
																		item,
																		`unit.title_${[
																			tabLang
																		]}`
																	)
																},
																{
																	title: t(
																		"Цена"
																	),
																	name: get(
																		item,
																		"price"
																	)
																},
																{
																	title: t(
																		"Кол-во"
																	),
																	name: (
																		<div>
																			{get(
																				item,
																				"quantity"
																			) &&
																				get(
																					item,
																					"quantity"
																				)}{" "}
																			{
																				item
																					.unit[
																					`title_${tabLang}`
																				]
																			}
																		</div>
																	)
																},
																{
																	title: t(
																		"Исчисляемый"
																	),
																	name: (
																		<div className="divider-wrapper">
																			<div
																				className="color-view-ellipse m-0-auto cursor-pointer"
																				onClick={() =>
																					quickUpdateCountable(
																						get(
																							item,
																							"id"
																						),
																						get(
																							item,
																							"countable"
																						)
																					)
																				}
																				style={{
																					backgroundColor:
																						Number.parseFloat(
																							get(
																								item,
																								"countable"
																							)
																						) ===
																						0
																							? "#f44336"
																							: "#4caf50"
																				}}
																			/>
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
																				className="color-view-ellipse m-0-auto cursor-pointer"
																				onClick={() =>
																					quickUpdateStatus(
																						Number(
																							get(
																								item,
																								"id"
																							)
																						),
																						Number(
																							get(
																								item,
																								"status"
																							)
																						)
																					)
																				}
																				style={{
																					backgroundColor:
																						Number(
																							get(
																								item,
																								"status"
																							)
																						) ===
																						1
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
											onChange={setPage}
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

export default List;
