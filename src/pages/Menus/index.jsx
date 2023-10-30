import React, { useState } from "react";

import { Table, Board } from "components";
import { Button, Pagination, Spin, Modal, notification } from "antd";
import EntityContainer from "modules/entity/containers";
import Create from "./components/Create";
import Update from "./components/Update";
import Actions from "modules/entity/actions";

import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

const Index = () => {
	const [createModal, showCreateModal] = useState(false);
	const [updateModal, showUpdateModal] = useState(false);
	const [selected, setSelected] = useState(null);
	const [page, setPage] = useState(1);

	const { t } = useTranslation("main");
	const dispatch = useDispatch();

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
				entity: "menu",
				name: `all`,
				id: id,
				url: `/menus/${id}`,
				deleteData: true,
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
				<Create {...{ showCreateModal }} />
			</Modal>
			<Modal
				visible={updateModal}
				onOk={() => showUpdateModal(true)}
				onCancel={() => showUpdateModal(false)}
				footer={null}
				centered
				width={430}
				destroyOnClose>
				<Update {...{ selected, showUpdateModal }} />
			</Modal>

			<div className="d-flex justify-content-between align-items-center mb-20">
				<div className="title-md">{t("Каталог")}</div>
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
				<EntityContainer.All
					entity="menu"
					name={`all`}
					url="/menus"
					params={{
						limit: 50,
						page,
						sort: "sort",
						include: "company",
						extra: { _l: "ru" }
					}}>
					{({ items, isFetched, meta }) => {
						return (
							<Spin spinning={!isFetched}>
								<div className="default-table pad-15">
									<Table
										hasEdit={true}
										hasDelete={true}
										rowKey="id"
										onEdit={value => openEditModal(value)}
										onDelete={value =>
											onDeleteHandler(value.id)
										}
										columns={[
											{
												title: t("ID"),
												dataIndex: "id",
												className: "w-50",
												render: value => (
													<div className="divider-wrapper">
														{value}
													</div>
												)
											},
											{
												title: t("Название (RU)"),
												dataIndex: "title_ru",
												render: value => (
													<div className="divider-wrapper">
														{value}
													</div>
												)
											},
											{
												title: t("Название (UZ)"),
												dataIndex: "title_uz",
												render: value => (
													<div className="divider-wrapper">
														{value}
													</div>
												)
											},
											{
												title: t("Название (EN)"),
												dataIndex: "title_en",
												render: value => (
													<div className="divider-wrapper">
														{value}
													</div>
												)
											},
											{
												title: t("Порядок"),
												dataIndex: "sort",
												render: value => (
													<div className="divider-wrapper">
														{value ? value : "-"}
													</div>
												)
											},
											{
												title: t("Статус"),
												dataIndex: "status",
												className: "text-cen w-82",
												render: value => {
													return (
														<div className="divider-wrapper">
															<div
																className="color-view-ellipse m-0-auto"
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
											},
											{
												title: "*",
												dataIndex: "eighteen",
												className: "text-cen w-82",
												render: value => {
													return (
														<div className="divider-wrapper">
															<div
																className="color-view-ellipse m-0-auto"
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
};

export default Index;
