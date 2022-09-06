import React, { useEffect, useState } from "react";
import { Button, Modal, notification, Pagination, Spin } from "antd";
import EntityContainer from "modules/entity/containers";
import Actions from "modules/entity/actions";
import EntityActions from "modules/entity/actions";
import { Fields, Table } from "components";

import { useTranslation } from "react-i18next";
import get from "lodash/get";
import useDebounce from "use-debounce/lib/useDebounce";
import { helpers, time } from "services";
import AddModal from "../../components/addModal";
import { useDispatch } from "react-redux";

const List = ({ selectedCategory }) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [query, setQuery] = useState("");
	const [searchQuery] = useDebounce(query, 600);
	const [page, setPage] = useState();
	const [addModal, showAddModal] = useState(false);
	const [filterAuthor, setFilterAuthor] = useState(null);
	const [data, setData] = useState();


	let sum = get(data, "sum", 0).toLocaleString();
	let uy = get(data, "uy", 0).toLocaleString();
	let bank = get(data, "bank", 0).toLocaleString();

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
			entity: "expenses",
			name: `all-${get(selectedCategory, "id")}`,
			id: id,
			url: `/expenses/${id}`,
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

	const loadAccountBalance = () => {
		dispatch(EntityActions.LoadDefault.request({
			url: "/crm/account-balance/transfer",
			cb: {
				success: (data) => {
					setData(data);
				},
				error: () => {
				}
			}
		}));
	};

	useEffect(() => {
		loadAccountBalance();
	}, []);


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
				<AddModal {...{ showAddModal, selectedCategory, loadAccountBalance }} />
			</Modal>
			<div className={"pt-15 pl-15 pr-15 d-flex justify-content-between align-items-center"}>
				<div className="fs-16">
					{/*<span className="--black pr-20">*/}
					{/*	<span className="pr-5">{t("Сум")}:</span>*/}
					{/*	<span className="fw-500">{sum}</span>*/}
					{/*</span>*/}
					{/*<span className="--black pr-20">*/}
					{/*	<span className="pr-5">{t("Вторичный")}:</span>*/}
					{/*	<span className="fw-500">{uy}</span>*/}
					{/*</span>*/}
					{/*<span className="--black">*/}
					{/*	<span className="pr-5">{t("Перечисление")}:</span>*/}
					{/*	<span className="fw-500">{bank}</span>*/}
					{/*</span>*/}
				</div>

				<Button
					type="primary"
					size="large"
					className="fs-14 fw-300"
					htmlType="button"
					onClick={() => showAddModal(true)}
				>{t("Добавить")}</Button>
			</div>
			<EntityContainer.All
				entity="expenses"
				name={`all-${get(selectedCategory, "id")}`}
				url="/expenses"
				primaryKey="id"
				params={{
					sort: "-id",
					limit: 15,
					page,
					filter: {
						category_id: get(selectedCategory, "id"),
					},
					include: "category,customer",
					extra: {
						name: searchQuery
					}
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
												title: t("Контрагент"),
												dataIndex: "customer",
												className: "text-cen",
												render: value => <div
													className="divider-wrapper">{value ? value.surname + " " + value.name : "-"}</div>
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
													{value ? helpers.formatDate(value, 'DD.MM.YYYY / HH:mm') : t("не указан")}
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
		</>
	);
};

export default List;
