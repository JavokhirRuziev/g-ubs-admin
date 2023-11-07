import React, { useState } from "react";
import { Table, Board, Panel } from "components";
import {
	Button,
	Pagination,
	Spin,
	Modal,
	notification,
	Tabs,
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
import useMediaQueries from "../../services/media-queries";
import Card from "../../components/Card/Card";
import { get } from "lodash";

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

	const changeTab = value => {
		history.push(`/clients?lang=${value}`);
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
				entity: "clients",
				name: `all`,
				id: id,
				url: `/clients/${id}`,
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
					<div>
						{/* <Input
							type="text"
							value={search}
							onChange={handleChange}
							placeholder={t("Поиск")}
						/> */}
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
					entity="clients"
					name={`all`}
					url="/clients"
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
													className: `text-align-left w-82`,
													render: value => {
														return (
															<div className="divider-wrapper">
																{items &&
																	items.findIndex(
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
													dataIndex: "name",
													render: value => (
														<div className="divider-wrapper">
															{value && value}
														</div>
													)
												},
												{
													title: t("Направление"),
													dataIndex: "direction",
													render: value => (
														<div className="divider-wrapper">
															{value && value}
														</div>
													)
												},
												{
													title: t("ИНН"),
													dataIndex: "tin",
													render: value => (
														<div className="divider-wrapper">
															{value && value}
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
																				"name"
																			)}
																		</div>
																	)
																},
																{
																	title: t(
																		"Направление"
																	),
																	name: (
																		<div className="divider-wrapper">
																			{get(
																				item,
																				"direction"
																			)}
																		</div>
																	)
																},
																{
																	title: t(
																		"ИНН"
																	),
																	name: (
																		<div className="divider-wrapper">
																			{get(
																				item,
																				"tin"
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
