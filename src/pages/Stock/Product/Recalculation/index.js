import React, { useEffect, useState } from "react";
import { Table, Board, Panel, Avatar } from "components";
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
import Actions from "modules/entity/actions";

import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import config from "config";
import qs from "query-string";
import axios from "axios";
import useMediaQueries from "../../../../services/media-queries";
import { get } from "lodash";
import thousandsDivider from "../../../../services/thousandsDivider/thousandsDivider";
import Card from "../../../../components/Card/Card";
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
	const { mobile } = useMediaQueries();
	const [stock, setStock] = useState();
	const [stock_id, setStock_id] = useState();
	const [category, setCategory] = useState();
	const [unit, setUnit] = useState();
	const { t } = useTranslation("main");
	const dispatch = useDispatch();
	const [total_amount, setTotal_amount] = useState();
	const colors = [
		{ name: "Критическое", value: "red" },
		{ name: "Нормальное", value: "yellow" },
		{ name: "Достаточное", value: "green" }
	];
	const [search, setSearch] = useState({
		category: Number(query.category),
		stock: "",
		unit: "",
		product: "",
		color: ""
	});

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
			.get(`${config.API_ROOT}/units?_l=${tabLang}&include=translate`)
			.then(res => {
				const categoryData = res.data.data;
				const newCategories = categoryData.map(stock => ({
					name: stock && stock[`title_${tabLang}`],
					value: stock && stock.id
				}));
				setUnit(newCategories);
			})
			.catch(err => console.log(err));
	}, [tabLang]);

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
			{/* <Board className="mb-40 mt-20">
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
												value={option.value}>
												{option.name}
											</Option>
									  ))}
							</Select>
						</div>
						<div>
							<Input
								type="text"
								value={search.product}
								onChange={e =>
									setSearch({
										...search,
										product: e.target.value
									})
								}
								placeholder={t("Поиск")}
							/>
						</div>
						<div>
							<Select
								placeholder={t("Остаток продуктов")}
								onChange={value =>
									setSearch({ ...search, color: value })
								}
								allowClear
								style={{ width: 200 }}>
								{colors.map(option => (
									<Option
										key={option.value}
										value={option.value}>
										{option.name}
									</Option>
								))}
							</Select>
						</div>
					</div>
					<div />
					<Button
						type="primary"
						size="large"
						className="fs-14 fw-300 ml-10"
						htmlType="button"
						onClick={() => showCreateModal(true)}>
						{t("Добавить")}
					</Button>
				</div>
			</Board> */}

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
					onSuccess={data => {
						setTotal_amount(data.total_amount);
					}}
					params={{
						include: "product.translate,product.unit,user",
						extra: {
							_l: tabLang,
							search: search.product,
							stock_id: search.stock,
							category_id: search.category,
							color: search.color
						},
						page
					}}>
					{({ items, isFetched, meta }) => {
						const filteredItems = items.filter(item => {
							const productCondition =
								!search.product ||
								item.translate.name.includes(search.product);
							const stockCondition =
								!search.stock || item.stock_id === search.stock;
							const categoryCondition =
								!search.category ||
								item.product_category_id === search.category;

							return (
								productCondition &&
								stockCondition &&
								categoryCondition
							);
						});

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
