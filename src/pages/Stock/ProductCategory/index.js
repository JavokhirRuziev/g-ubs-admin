import React, { useEffect, useState } from "react";
import { Table, Board, Panel } from "components";
import {
	Button,
	Pagination,
	Spin,
	Modal,
	notification,
	Tabs,
	Input,
	Select
} from "antd";
import EntityContainer from "modules/entity/containers";
import Create from "./components/Create";
import Update from "./components/Update";
import Actions from "modules/entity/actions";
import { Fields } from "components";

import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import config from "config";
import qs from "query-string";
import axios from "axios";
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
	const [search, setSearch] = useState({ category: "", stock: "" });
	const [stock, setStock] = useState();

	useEffect(() => {
		axios
			.get(`${config.API_ROOT}/stocks?_l=${tabLang}&include=translate`)
			.then(res => {
				const categoryData = res.data.data;
				const newCategories = categoryData.map(stock => ({
					name: stock.translate && stock.translate.name,
					value: stock.translate && stock.translate.stock_id
				}));
				setStock(newCategories);
			})
			.catch(err => console.log(err));
	}, []);

	const { t } = useTranslation("main");
	const dispatch = useDispatch();

	const changeTab = value => {
		history.push(`/stock/product-categories?lang=${value}`);
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
				entity: "product-categories",
				name: `all`,
				id: id,
				url: `/product-categories/${id}`,
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
							flexWrap: "wrap"
						}}>
						<div>
							<Select
								placeholder={t("Склад")}
								onChange={value =>
									setSearch({ ...search, stock: value })
								}
								allowClear
								style={{ width: 200 }}>
								{stock &&
									stock.map(option => (
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
								value={search.category}
								onChange={e =>
									setSearch({
										...search,
										category: e.target.value
									})
								}
								placeholder={t("Поиск")}
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
					entity="product-categories"
					name={`all`}
					url="/product-categories"
					params={{
						include: "translate,stock",
						extra: {
							_l: tabLang,
							stock_id: search.stock,
							search: search.category
						}
					}}>
					{({ items, isFetched, meta }) => {
						const filteredItems = items.filter(item => {
							if (search.category) {
								return item.translate.name.includes(
									search.category
								);
							}

							if (search.stock) {
								return (
									Number(item.stock_id) ===
									Number(search.stock)
								);
							}

							return true; // If neither category nor stock filter is provided, include the item.
						});

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
												title: t("Склад"),
												dataIndex:
													"stock.translate.name",
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
										dataSource={filteredItems}
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
