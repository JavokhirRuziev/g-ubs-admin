import React, { useState } from "react";

import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { ReactComponent as PlusIcon } from "assets/images/icons/plus.svg";

import { Button, Modal, notification, Spin } from "antd";
import Actions from "modules/entity/actions";
import Create from "./FinishedProdCreate";
import Update from "./FinishedProdUpdate";
import { useDispatch } from "react-redux";
import { Table } from "components";
import EntityContainer from "modules/entity/containers";
import qs from "query-string";

const FinishedProduct = ({ location, values }) => {
	const query = qs.parse(location.search);
	const { lang } = query;
	const { t } = useTranslation("main");
	const params = useParams();
	const dispatch = useDispatch();

	const { id } = params;
	const [createModal, showCreateModal] = useState(false);
	const [updateModal, showUpdateModal] = useState(false);
	const [selected, setSelected] = useState(null);
	const [canUpdate, setCanUpdate] = useState(false);
	const [tabLang, setTabLang] = useState(lang ? lang : "ru");

	const onDeleteHandler = productId => {
		Modal.confirm({
			title: t("Вы действительно хотите удалить?"),
			okText: t("да"),
			okType: "danger",
			cancelText: t("нет"),
			confirmLoading: true,
			onOk: () => deleteAction(productId)
		});
	};
	const deleteAction = productId => {
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "ingredients",
				name: `all-${id}`,
				id: productId,
				url: `/${id}/finished-dish-relations/${productId}`,
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
	const openEditModal = value => {
		setSelected(value);
		showUpdateModal(true);
	};
	return (
		<div className="mt-30">
			<Modal
				visible={createModal}
				onOk={() => showCreateModal(true)}
				onCancel={() => showCreateModal(false)}
				footer={null}
				centered
				width={400}
				destroyOnClose>
				<Create
					{...{
						showCreateModal,
						parent_id: id,
						lang: tabLang,
						selected,
						setCanUpdate,
						values
					}}
				/>
			</Modal>
			<Modal
				visible={updateModal}
				onOk={() => showUpdateModal(true)}
				onCancel={() => showUpdateModal(false)}
				footer={null}
				centered
				width={400}
				destroyOnClose>
				<Update
					{...{
						selected,
						showUpdateModal,
						parent_id: id,
						lang: tabLang,
						id,
						setCanUpdate,
						values
					}}
				/>
			</Modal>

			<div className="d-flex align-items-center justify-content-between mb-20">
				<div className="ant-label">{t("Готовый продукт")}</div>
				<Button
					type="primary"
					size="large"
					className="fs-14 fw-300 btn-with-icon"
					htmlType="button"
					onClick={() => showCreateModal(true)}>
					<PlusIcon className={"mr-0"} />
				</Button>
			</div>

			<EntityContainer.All
				entity="finished-dish-relations"
				name={`all-${id}`}
				url={`${id}/finished-dish-relations`}
				canUpdate={canUpdate}
				params={{
					sort: "-id",
					extra: { _l: tabLang, include: "unit" }
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<Spin spinning={!isFetched}>
							<div className="default-table default-table--wb">
								<Table
									hasDelete={true}
									hasEdit={true}
									rowKey="id"
									onDelete={value =>
										onDeleteHandler(value.id)
									}
									onEdit={value => openEditModal(value)}
									columns={[
										{
											title: t("No"),
											dataIndex: `id`,
											className: "text-align-left w-82",
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
											title: t("Названия"),
											dataIndex: `finished_dish.translate.name`,
											render: value => (
												<div className="divider-wrapper">
													{value}
												</div>
											)
										},
										{
											title: t("Количество"),
											dataIndex: "",
											className: "text-cen w-82",
											render: value => {
												return (
													<div className="divider-wrapper">
														{value.count}{" "}
														{
															value.finished_dish
																.unit[
																`title_${lang}`
															]
														}
													</div>
												);
											}
										}
									]}
									dataSource={items}
								/>
							</div>
						</Spin>
					);
				}}
			</EntityContainer.All>
		</div>
	);
};

export default FinishedProduct;
