import React, { useState } from "react";
import {Button, Modal, notification, Pagination, Spin} from "antd";
import EntityContainer from "modules/entity/containers";
import {Board, Table} from "components";

import { useTranslation } from "react-i18next";
import { helpers } from "services";
import AddModal from "../../components/addModal";
import {useDispatch} from "react-redux";
import Actions from "modules/entity/actions";
import get from "lodash/get";

const List = ({selectedCategory}) => {
	const { t } = useTranslation();
	const [page, setPage] = useState();
	const dispatch = useDispatch();
	const [addModal, showAddModal] = useState(false);

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
		dispatch(Actions.Form.request({
			method: "delete",
			entity: "incomes",
			name: selectedCategory ? `all-${get(selectedCategory, "id")}` : `all-0`,
			id: id,
			url: `/transactions/${id}`,
			deleteData: true,
			primaryKey: "id",
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
				finally: () => { }
			}
		}));
	};

	return (
		<>
			<Modal
				visible={addModal}
				onOk={() => showAddModal(true)}
				onCancel={() => showAddModal(false)}
				footer={null}
				centered
				width={430}
				destroyOnClose
			>
				<AddModal {...{ showAddModal, selectedCategory }} />
			</Modal>
			<div className={"d-flex justify-content-between align-items-center mb-10"}>
				<div className="title-md">{t("Приход")}</div>

				{(get(selectedCategory, 'alias') === 'others' || get(selectedCategory, 'alias') === 'debt') && (
					<Button
						type="primary"
						size="large"
						className="fs-14 fw-300"
						htmlType="button"
						onClick={() => showAddModal(true)}
					>{t("Добавить")}</Button>
				)}

			</div>
			<Board calc={160}>
				<EntityContainer.All
					entity="incomes"
					name={selectedCategory ? `all-${get(selectedCategory, "id")}` : `all-0`}
					url="/transactions"
					primaryKey="id"
					params={{
						sort: "-id",
						limit: 15,
						filter: {
							type: 2,
							category_id: get(selectedCategory, "id"),
						},
						page,
						include: "category,customer",
					}}
				>
					{({ items, isFetched, meta }) => {
						return (
							<>
								<div className="default-table pad-15"
									 style={{ height: "100%", overflow: "hidden", overflowY: "auto" }}>
									<Spin spinning={!isFetched}>
										<Table
											hasDelete={true}
											onDelete={value => onDeleteHandler(value.id)}
											rowKey={"id"}
											columns={[
												{
													title: t("ID"),
													dataIndex: "id",
													className: "w-50 text-cen",
													render: value => <div className="divider-wrapper">{value}</div>
												},
												{
													title: t("Категория"),
													dataIndex: "category",
													className: "text-cen",
													render: value => <div
														className="divider-wrapper">{value ? value.title : "-"}</div>
												},
												{
													title: t("Клиент"),
													dataIndex: "customer.name",
													render: value => <div
														className="divider-wrapper">{value ? value : '-'}</div>
												},
												{
													title: t("Сумма"),
													dataIndex: "value",
													className: "text-cen",
													render: value => <div className="divider-wrapper">
														{value ? helpers.convertToReadable(value) : ""}
													</div>
												},
												{
													title: t("Тип суммы"),
													dataIndex: "price_type",
													className: "text-cen",
													render: value => <div className="divider-wrapper">
														{helpers.getPaymentTypeExpenses(value)}
													</div>
												},
												{
													title: t("Комментария"),
													dataIndex: "comment",
													className: "text-cen max-w-200",
													render: value => <div className="divider-wrapper">
														{value ? value : "-"}
													</div>
												},
												{
													title: t("Дата"),
													dataIndex: "added_at",
													className: "text-cen",
													render: value => <div className="divider-wrapper">
														{value ? helpers.formatDate(value, 'DD.MM.YYYY') : t("не указан")}
													</div>
												}
											]}
											dataSource={items}
										/>
									</Spin>
								</div>
								{meta && meta.perPage && (
									<div className="pad-15 d-flex justify-content-end">
										<Pagination
											current={meta.currentPage}
											pageSize={meta.perPage}
											total={meta.totalCount}
											onChange={(page) => {
												setPage(page)
												let content = document.querySelector(".default-table");

												if (content) {
													content.scrollTo({
														behavior: "smooth",
														top: 0,
														left: 0
													})
												}
											}}
										/>
									</div>
								)}
							</>
						);
					}}
				</EntityContainer.All>
			</Board>
		</>
	);
};

export default List;
