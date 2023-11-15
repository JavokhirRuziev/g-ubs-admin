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
import useMediaQueries from "../../services/media-queries";
import Card from "../../components/Card/Card";
import { get } from "lodash";
import { Field, Formik } from "formik";
import { Fields } from "components";

export default function index({ location, history }) {
	const TabPane = Tabs.TabPane;
	const [createModal, showCreateModal] = useState(false);
	const [updateModal, showUpdateModal] = useState(false);
	const [selected, setSelected] = useState(null);
	const [page, setPage] = useState(1);
	const query = qs.parse(location.search);
	const { lang } = query;
	const [tabLang, setTabLang] = useState(lang || "ru");
	const [search, setSearch] = useState();
	const { mobile } = useMediaQueries();

	const handleChange = e => {
		setSearch(e.target.value);
	};

	const { t } = useTranslation("main");
	const dispatch = useDispatch();

	const onConfirmHandler = item => {
		Modal.confirm({
			title: t("Вы действительно хотите подтвердить?"),
			okText: t("да"),
			okType: "success",
			cancelText: t("нет"),
			confirmLoading: true,
			onOk: () => confirmAction(item)
		});
	};

	const confirmAction = value => {
		dispatch(
			Actions.Form.request({
				method: "post",
				entity: "recalculation-requests",
				name: `all`,
				url: `/recalculation-requests`,
				values: {
					item_id: value.item_id,
					count: value.query.count,
					request_id: value.id,
					status: "completed",
					type: value.type
				},
				normalizeData: data => data,
				prependData: true,
				cb: {
					success: () => {
						notification["success"]({
							message: t("Успешно подтверждено"),
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

	const onRejectHandler = item => {
		Modal.confirm({
			title: t("Вы действительно хотите отклонить?"),
			okText: t("да"),
			okType: "danger",
			cancelText: t("нет"),
			confirmLoading: true,
			onOk: () => rejectAction(item)
		});
	};

	const rejectAction = value => {
		dispatch(
			Actions.Form.request({
				method: "post",
				entity: "recalculation-requests",
				name: `all`,
				url: `/recalculation-requests`,
				values: {
					item_id: value.item_id,
					count: value.query.count,
					request_id: value.id,
					status: "rejected",
					type: value.type
				},
				normalizeData: data => data,
				prependData: true,
				cb: {
					success: () => {
						notification["success"]({
							message: t("Успешно отклонено"),
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
				<div className="title-md">{t("Подтверждение перерасчета")}</div>
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
			{/* <Board className="mb-40 mt-20">
				<div className="d-flex justify-content-between align-items-center pad-10">
					<div>
						<Formik>
							<Field
								component={Fields.AntInput}
								name="name"
								type="text"
								placeholder={t("Поиск")}
								size="large"
								onChange={handleChange}
								value={search}
								style={{
									marginBottom: "0px"
								}}
							/>
						</Formik>
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
			</Board> */}

			<Board className="border-none">
				<EntityContainer.All
					entity="stocks"
					name={`all`}
					url="/recalculation-requests"
					params={{
						extra: {
							_l: tabLang,
							search: search
						},
						page
					}}>
					{({ items, isFetched, meta }) => {
						const filteredItems = search
							? items.filter(item =>
									item.translate.name.includes(search)
							  )
							: items;

						return (
							<Spin spinning={!isFetched}>
								{!mobile ? (
									<div className="default-table pad-15">
										<Table
											hasConfirm={true}
											hasReject={true}
											onConfirm={value =>
												onConfirmHandler(value)
											}
											onReject={value =>
												onRejectHandler(value)
											}
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
													dataIndex: "message",
													render: value => (
														<div className="divider-wrapper">
															{value}
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
																				"translate.name"
																			)}
																		</div>
																	)
																},
																{
																	title: t(
																		"Описания"
																	),
																	name: (
																		<div className="divider-wrapper">
																			{get(
																				item,
																				"translate.name"
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
