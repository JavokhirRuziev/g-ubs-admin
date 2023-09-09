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
const { Option } = Select;

export default function index({ location, history, match }) {
	const TabPane = Tabs.TabPane;
	const [createModal, showCreateModal] = useState(false);
	const [updateModal, showUpdateModal] = useState(false);
	const [selected, setSelected] = useState(null);
	const [page, setPage] = useState(1);
	const query = qs.parse(location.search);
	const { lang } = query;
	const [tabLang, setTabLang] = useState(lang || "ru");
	const { id } = match.params;
	const [search, setSearch] = useState({
		category: "",
		stock: "",
		unit: "",
		product: ""
	});
	const [stock, setStock] = useState();
	const [stock_id, setStock_id] = useState();
	const [category, setCategory] = useState();
	const [unit, setUnit] = useState();
	const { t } = useTranslation("main");
	const dispatch = useDispatch();

	useEffect(() => {
		axios
			.get(`${config.API_ROOT}/stocks?_l=${tabLang}`)
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
			.get(`${config.API_ROOT}/product-categories?_l=${tabLang}`)
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
				console.log(categoryData);
			})
			.catch(err => console.log(err));
	}, [stock_id]);

	console.log(search);

	const changeTab = value => {
		history.push(`/stock/products?lang=${value}`);
	};

	const openEditModal = value => {
		setSelected(value);
		showUpdateModal(true);
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
				entity: "products",
				name: `all`,
				id: id,
				url: `/products/${id}`,
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
				<Update {...{ selected, showUpdateModal, tabLang, id }} />
			</Modal>

			<div className="d-flex justify-content-between align-items-center mb-20">
				<div className="title-md">{t("Ед. изм")}</div>
				<Button
					type="primary"
					size="large"
					className="fs-14 fw-300 ml-10"
					htmlType="button"
					onClick={() => showCreateModal(true)}>
					{t("Добавить")}
				</Button>
			</div>

			<div
				style={{
					display: "flex",
					marginBottom: "20px",
					justifyContent: "center",
					columnGap: "15px"
				}}>
				<div>
					<Select
						defaultValue={t("Склад")}
						onChange={value => {
							setSearch({ ...search, stock: value });
						}}
						style={{ width: 200 }}>
						{stock &&
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
						defaultValue={t("Категория")}
						onChange={value =>
							setSearch({ ...search, category: value })
						}
						style={{ width: 200 }}>
						{category &&
							category.map(option => (
								<Option key={option.value} value={option.value}>
									{option.name}
								</Option>
							))}
					</Select>
				</div>

				{/* <div>
					<Select
						defaultValue={"unit"}
						onChange={value => {
							setSearch({ ...search, unit: value });
						}}
						style={{ width: 200 }}>
						{unit &&
							unit.map(option => (
								<Option key={option.value} value={option.value}>
									{option.name}
								</Option>
							))}
					</Select>
				</div> */}

				<div>
					<Input
						type="text"
						value={search.product}
						onChange={e =>
							setSearch({ ...search, product: e.target.value })
						}
						placeholder="search"
					/>
				</div>
			</div>

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
					entity="products"
					name={`all`}
					url="/products"
					params={{
						include: "translate",
						extra: {
							_l: tabLang,
							search: search.product,
							stock_id: search.stock,
							category_id: search.category
						}
					}}>
					{({ items, isFetched, meta }) => {
						return (
							<Spin spinning={!isFetched}>
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
												title: t("Название"),
												dataIndex: "translate.name",
												render: value => (
													<div className="divider-wrapper">
														{value}
													</div>
												)
											},
											{
												title: t("Описания"),
												dataIndex:
													"translate.description",
												render: value => (
													<div className="divider-wrapper">
														{value}
													</div>
												)
											},
											{
												title: t("Количество"),
												dataIndex: "id" && "count",
												render: (value, item) => (
													<div className="divider-wrapper">
														<div
															style={{
																background:
																	Number.parseFloat(
																		value
																	) <=
																	Number.parseFloat(
																		item.deficit_threshold
																	)
																		? "rgba(255,0,0,1.7)"
																		: Number.parseFloat(
																				value
																		  ) >=
																				Number.parseFloat(
																					item.deficit_threshold
																				) &&
																		  Number.parseFloat(
																				value
																		  ) <=
																				Number.parseFloat(
																					item.average_quantity
																				)
																		? "rgba(255,200,0,1.7)"
																		: value >=
																		  Number.parseFloat(
																				item.average_quantity
																		  )
																		? "rgba(0,255,0,1.7)"
																		: "#fff",
																color: "black",
																fontWeight:
																	"700",
																padding: "5px",
																fontSize: "16px"
															}}>
															{value}{" "}
															{
																item.unit[
																	`title_${tabLang}`
																]
															}
														</div>
													</div>
												)
											},
											{
												title: t("Склад"),
												dataIndex: `stock.translate.name`,
												render: value => (
													<div className="divider-wrapper">
														{value}
													</div>
												)
											},
											{
												title: t("Категория"),
												dataIndex: `category.translate.name`,
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
