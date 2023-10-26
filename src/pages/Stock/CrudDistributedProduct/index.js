import React, { useEffect, useState } from "react";
import { Table, Board, Panel } from "components";
import {
	Button,
	Pagination,
	Spin,
	Modal,
	notification,
	Tabs,
	Select,
	Input
} from "antd";
import EntityContainer from "modules/entity/containers";
import Create from "./components/Create";
import Update from "./components/Update";
import Actions from "modules/entity/actions";

import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import config from "config";
import qs from "query-string";
import axios from "axios";
import useMediaQueries from "../../../services/media-queries";
import Card from "../../../components/Card/Card";
import get from "lodash/get";
import { dateFormatter } from "../../../services/dateFormatter";
const { Option } = Select;

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
			from: query.start_at ? start_at : "",
			to: query.end_at ? end_at : ""
		}
	});
	const [stock, setStock] = useState();
	const [stock_id, setStock_id] = useState();
	const [product_category_id, setProduct_category_id] = useState();
	const [product, setProduct] = useState();
	const [category, setCategory] = useState();
	const [unit, setUnit] = useState();
	const { mobile } = useMediaQueries();
	const [filteredOptions, setFilteredOptions] = useState();

	useEffect(() => {
		axios
			.get(`${config.API_ROOT}/stocks?_l=${tabLang}&include=translate`)
			.then(res => {
				const categoryData = res.data.data;
				const newCategories = categoryData.map(stock => ({
					name: stock.translate && stock.translate.name,
					value: stock.translate && stock.translate.stock_id,
					stock_id: stock.translate && stock.translate.stock_id
				}));
				setStock(newCategories);
			})
			.catch(err => console.log(err));

		axios
			.get(`${config.API_ROOT}/units?_l=${tabLang}`)
			.then(res => {
				const categoryData = res.data.data;
				const newCategories = categoryData.map(stock => ({
					name: stock && stock[`title_${tabLang}`],
					value: stock && stock.id
				}));
				setUnit(newCategories);
			})
			.catch(err => console.log(err));
	}, []);

	useEffect(() => {
		axios
			.get(
				`${config.API_ROOT}/product-categories?_l=${tabLang}&include=translate,stock`
			)
			.then(res => {
				const categoryData = res.data.data;
				const newCategories = categoryData
					.filter(item => {
						if (item.stock.translate.stock_id === stock_id) {
							return item;
						}
					})
					.map(category => ({
						name: category.translate && category.translate.name,
						value:
							category.translate &&
							category.translate.product_category_id,
						stock_id:
							category.stock.translate &&
							category.stock.translate.stock_id
					}));
				setCategory(newCategories);
			})
			.catch(err => console.log(err));
	}, [stock_id]);

	useEffect(() => {
		axios
			.get(
				`${config.API_ROOT}/products?_l=${tabLang}&include=translate,stock,category`
			)
			.then(res => {
				const categoryData = res.data.data;
				const newCategories = categoryData
					.filter(item => {
						if (item.product_category_id === product_category_id) {
							return item;
						}
					})
					.map(category => ({
						name: category.translate && category.translate.name,
						value: category && category.id
					}));
				setProduct(newCategories);
			})
			.catch(err => console.log(err));
	}, [product_category_id]);

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
					<div
						style={{
							display: "flex",
							columnGap: "10px",
							rowGap: "10px",
							flexWrap: "wrap"
						}}>
						<div>
							<Select
								placeholder={t("Склад")}
								onChange={value => {
									setSearch({ ...search, stock: value });
								}}
								allowClear
								showSearch
								optionFilterProp="children"
								onSearch={value => {
									const filteredOptions = stock.filter(
										option =>
											option.name
												.toLowerCase()
												.includes(value.toLowerCase())
									);
									setFilteredOptions({
										...filteredOptions,
										stock: filteredOptions
									});
								}}
								filterOption={(input, option) =>
									option.props.children
										.toLowerCase()
										.indexOf(input.toLowerCase()) >= 0
								}
								style={{ width: 200 }}>
								{filteredOptions && filteredOptions.stock
									? filteredOptions.stock.map(option => (
											<Option
												key={option.value}
												value={option.value}
												onClick={() =>
													setStock_id(option.stock_id)
												}>
												{option.name}
											</Option>
									  ))
									: stock &&
									  stock.map(option => (
											<Option
												key={option.value}
												value={option.value}
												onClick={() =>
													setStock_id(option.stock_id)
												}>
												{option.name}
											</Option>
									  ))}
							</Select>
						</div>
						<div>
							<Select
								placeholder={t("Категория")}
								onChange={value =>
									setSearch({ ...search, category: value })
								}
								allowClear
								showSearch
								optionFilterProp="children"
								onSearch={value => {
									const filteredOptions = category.filter(
										option =>
											option.name
												.toLowerCase()
												.includes(value.toLowerCase())
									);
									setFilteredOptions({
										...filteredOptions,
										category: filteredOptions
									});
								}}
								filterOption={(input, option) =>
									option.props.children
										.toLowerCase()
										.indexOf(input.toLowerCase()) >= 0
								}
								style={{ width: 200 }}>
								{filteredOptions && filteredOptions.category
									? filteredOptions.category.map(option => (
											<Option
												key={option.value}
												value={option.value}>
												{option.name}
											</Option>
									  ))
									: category &&
									  category.map(option => (
											<Option
												key={option.value}
												value={option.value}
												onClick={() =>
													setProduct_category_id(
														option.value
													)
												}>
												{option.name}
											</Option>
									  ))}
							</Select>
						</div>
						<div>
							<Select
								placeholder={t("Продукт")}
								onChange={value =>
									setSearch({ ...search, product: value })
								}
								allowClear
								showSearch
								optionFilterProp="children"
								onSearch={value => {
									const filteredOptions = product.filter(
										option =>
											option.name
												.toLowerCase()
												.includes(value.toLowerCase())
									);
									setFilteredOptions({
										...filteredOptions,
										product: filteredOptions
									});
								}}
								filterOption={(input, option) =>
									option.props.children
										.toLowerCase()
										.indexOf(input.toLowerCase()) >= 0
								}
								style={{ width: 200 }}>
								{filteredOptions && filteredOptions.product
									? filteredOptions.product.map(option => (
											<Option
												key={option.value}
												value={option.value}>
												{option.name}
											</Option>
									  ))
									: product &&
									  product.map(option => (
											<Option
												key={option.value}
												value={option.value}>
												{option.name}
											</Option>
									  ))}
							</Select>
						</div>
						<div>
							<Input
								type="date"
								value={search.data.from}
								allowClear
								onChange={e =>
									setSearch({
										...search,

										data: {
											from: e.target.value,
											to: search.data.to
										}
									})
								}
							/>
						</div>
						<div>
							<Input
								type="date"
								value={search.data.to}
								allowClear
								onChange={e =>
									setSearch({
										...search,
										data: {
											to: e.target.value,
											from: search.data.from
										}
									})
								}
							/>
						</div>
					</div>
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
							date_from: search.data.from,
							date_to: search.data.to
						},
						page
					}}>
					{({ items, isFetched, meta }) => {
						const filteredItems =
							items &&
							items.filter(item => {
								const {
									product,
									stock,
									category,
									data: { from: fromDate, to: toDate }
								} = search;

								return (
									(!product || product === item.product_id) &&
									(!stock || item.stock_id === stock) &&
									(!category ||
										item.product.product_category_id ===
											category) &&
									(!fromDate ||
										item.created_at >= fromDate) &&
									(!toDate || item.created_at <= toDate)
								);
							});

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
											dataSource={filteredItems}
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
										{filteredItems &&
											filteredItems.map((item, index) => {
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
