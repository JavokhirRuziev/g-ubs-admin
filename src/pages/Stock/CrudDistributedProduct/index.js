import React, { useState } from "react";
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
import Card from "../../../components/Card/Card";
import get from "lodash/get";
import { dateFormatter } from "../../../services/dateFormatter";
import Filters from "./components/Filters";
import moment from "moment";

export default function index({ location, history }) {
	const TabPane = Tabs.TabPane;
	const [createModal, showCreateModal] = useState(false);
	const [updateModal, showUpdateModal] = useState(false);
	const [selected, setSelected] = useState(null);
	const [page, setPage] = useState(1);
	const query = qs.parse(location.search);
	const { lang } = query;
	const [tabLang, setTabLang] = useState(lang || "ru");
	const { t } = useTranslation("main");
	const dispatch = useDispatch();
	const timestamp_start = query.start_at;
	const date_start = new Date(timestamp_start * 1000);
	const year_start = date_start.getFullYear();
	const month_start = String(date_start.getMonth() + 1).padStart(2, "0");
	const day_start = String(date_start.getDate()).padStart(2, "0");

	const timestamp_end = query.end_at;
	const date_end = new Date(timestamp_end * 1000);
	const year_end = date_end.getFullYear();
	const month_end = String(date_end.getMonth() + 1).padStart(2, "0");
	const day_end = String(date_end.getDate()).padStart(2, "0");

	const start_at = `${year_start}-${month_start}-${day_start}`;
	const end_at = `${year_end}-${month_end}-${day_end}`;
	const [search, setSearch] = useState({
		category: Number(query.category),
		stock: "",
		unit: "",
		product: "",
		data: {
			from:
				query.start_at && query.start_at !== "undefined"
					? moment.unix(query.start_at)
					: "",
			to:
				query.end_at && query.end_at !== "undefined"
					? moment.unix(query.end_at)
					: ""
		}
	});
	const [stock, setStock] = useState();
	const [stock_id, setStock_id] = useState();
	const [product_category_id, setProduct_category_id] = useState();
	const [product, setProduct] = useState();
	const [category, setCategory] = useState();
	const { mobile } = useMediaQueries();
	const [filteredOptions, setFilteredOptions] = useState();

	const changeTab = value => {
		history.push(`/stock/stock-distributed-products?lang=${value}`);
	};

	const openEditModal = value => {
		setSelected(value);
		showUpdateModal(true);
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
				entity: "stock-distributed-products",
				name: `all`,
				id: id,
				url: `/stock-distributed-products/${id}`,
				deleteData: true,
				cb: {
					success: () => {
						notification["success"]({
							message: t("Успешно удалена"),
							duration: 2
						});
						window.location.reload();
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
				<div className="title-md">{t("Распределенный продукт")}</div>
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
				<Update {...{ selected, showUpdateModal, tabLang }} />
			</Modal>
			<Board className="mb-40 mt-20">
				<div className="d-flex justify-content-between align-items-center pad-10">
					<Filters
						{...{
							search,
							setSearch,
							filteredOptions,
							setFilteredOptions,
							stock,
							setStock,
							category,
							setCategory,
							product,
							setProduct,
							stock_id,
							setStock_id,
							product_category_id,
							setProduct_category_id,
							tabLang,
							t,
							query
						}}
					/>
					<Button
						type="primary"
						size="large"
						className="fs-14 fw-300 ml-10"
						htmlType="button"
						onClick={() => showCreateModal(true)}>
						{t("Добавить")}
					</Button>
				</div>
			</Board>

			<Board className="border-none">
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
				<EntityContainer.All
					entity="stock-distributed-products"
					name={`all`}
					url="/stock-distributed-products"
					params={{
						include: "stock,product,user",
						extra: {
							_l: tabLang,
							stock_id: search.stock,
							category_id: search.category,
							product_id: search.product,
							date_from: search.data.from
								? moment(search.data.from).unix()
								: "",
							date_to: search.data.to
								? moment(search.data.to).unix()
								: ""
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
											onEdit={value => {
												openEditModal(value);
											}}
											onDelete={value =>
												onDeleteHandler(value.id)
											}
											columns={[
												{
													title: t("No"),
													dataIndex: `id`,
													className:
														"text-align-left",
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
													title: t("Количество"),
													dataIndex: "count",
													render: value => (
														<div className="divider-wrapper">
															{value}
														</div>
													)
												},
												{
													title: t("Дата"),
													dataIndex: "created_at",
													render: value => (
														<div className="divider-wrapper">
															{dateFormatter(
																value
															)}
														</div>
													)
												},
												{
													title: t("Склад"),
													dataIndex: "",
													render: value => (
														<div className="divider-wrapper">
															{value &&
																value.stock &&
																value.stock
																	.translate &&
																value.stock
																	.translate
																	.name &&
																value.stock
																	.translate
																	.name}
														</div>
													)
												},
												{
													title: t(
														"Имя пользователя"
													),
													dataIndex: "",
													render: value => (
														<div className="divider-wrapper">
															{value &&
																value.user &&
																value.user
																	.name &&
																value.user.name}
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
																				"product.translate.name"
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
																			{get(
																				item,
																				"count"
																			)}
																		</div>
																	)
																},
																{
																	title: t(
																		"Дата"
																	),
																	name: (
																		<div className="divider-wrapper">
																			{dateFormatter(
																				get(
																					item,
																					"created_at"
																				)
																			)}
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
																		"Имя пользователя"
																	),
																	name: (
																		<div className="divider-wrapper">
																			{item &&
																				item.user &&
																				item
																					.user
																					.name &&
																				item
																					.user
																					.name}
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
