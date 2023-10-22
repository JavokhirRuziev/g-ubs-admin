import React, { useEffect, useState } from "react";
import { Table, Board, Panel } from "components";
import { Pagination, Spin, Modal, Tabs, Input, Button } from "antd";
import EntityContainer from "modules/entity/containers";
import Create from "./components/Create";
import Update from "./components/UpdateCreate";

import { useTranslation } from "react-i18next";
import config from "config";
import qs from "query-string";
import useMediaQueries from "../../../services/media-queries/index";
import Card from "../../../components/Card/Card";
import { get } from "lodash";
import { Avatar } from "../../../components";
import { thousandsDivider } from "../../../services/thousandsDivider";
import axios from "axios";

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
	const [isDisabled, setIsDisabled] = useState();
	const { mobile } = useMediaQueries();

	const handleChange = e => {
		setSearch(e.target.value);
	};

	const { t } = useTranslation("main");

	const changeTab = value => {
		history.push(`/finished-product?lang=${value}`);
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
					<div>
						<Button
							type="primary"
							size="large"
							className="fs-14 fw-300 ml-10"
							htmlType="button"
							onClick={() => showUpdateModal(true)}>
							{t("Изменить")}
						</Button>
						<Button
							type="primary"
							size="large"
							className="fs-14 fw-300 ml-10"
							htmlType="button"
							// disabled={!isDisabled}
							onClick={() => showCreateModal(true)}>
							{t("Добавить")}
						</Button>
					</div>
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
					entity="stocks"
					name={`all`}
					url="/recalculation-finished-dishes"
					params={{
						include: "finished_dish,kitchener",
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
													title: t("Фото"),
													dataIndex:
														"finished_dish.file",
													className: "w-82 text-cen",
													render: value => (
														<div className="divider-wrapper">
															<Avatar
																isRectangle
																isProduct
																image={get(
																	value,
																	"thumbnails.small.src"
																)}
															/>
														</div>
													)
												},
												{
													title: t("Название"),
													dataIndex:
														"finished_dish.translate.name",
													render: value => (
														<div className="divider-wrapper">
															{value}
														</div>
													)
												},
												{
													title: t("Повар"),
													dataIndex: "kitchener.name",
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
																value.finished_dish &&
																value
																	.finished_dish
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
																		.finished_dish
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
															imgTiny: get(
																item,
																"finished_dish.file.thumbnails.small.src"
															),
															img: get(
																item,
																"finished_dish.file.thumbnails.small.src"
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
																				"finished_dish.translate.name"
																			)}
																		</div>
																	)
																},
																{
																	title: t(
																		"Повар"
																	),
																	name: (
																		<div className="divider-wrapper">
																			{get(
																				item,
																				"kitchener.name"
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
																			{thousandsDivider(
																				Number.parseFloat(
																					item.old_count
																				)
																			)}{" "}
																			{item &&
																				item.finished_dish &&
																				item
																					.finished_dish
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
																			{thousandsDivider(
																				Number.parseFloat(
																					item.new_count
																				)
																			)}{" "}
																			{
																				item
																					.finished_dish
																					.unit[
																					`title_${tabLang}`
																				]
																			}
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
