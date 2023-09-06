import React, { useEffect, useState } from "react";
import { Table, Board, Panel } from "components";
import { Button, Pagination, Spin, Modal, notification, Tabs } from "antd";
import EntityContainer from "modules/entity/containers";
import Create from "./components/Create";
import Update from "./components/Update";
import Actions from "modules/entity/actions";

import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import axios from "axios";
import config from "config";
import qs from "query-string";

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
						include: "translate",
						extra: { _l: tabLang }
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
											console.log(value);
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
												dataIndex:
													"product.translate.name",
												render: value => (
													<div className="divider-wrapper">
														{value}
														{/* {console.log(value)} */}
													</div>
												)
											},
											{
												title: t("Описания"),
												dataIndex:
													"product.translate.description",
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
												title: t("Склад"),
												dataIndex: "",
												render: value => (
													<div className="divider-wrapper">
														{
															value.stock
																.translate.name
														}
													</div>
												)
											},
											{
												title: t("Имя пользователя"),
												dataIndex: "",
												render: value => (
													<div className="divider-wrapper">
														{value.user.name}
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
