import React, { useEffect, useState } from "react";
import { Table, Board, Panel } from "components";
import { Button, Pagination, Spin, Modal, Tabs, Select, Input } from "antd";
import EntityContainer from "modules/entity/containers";
import Create from "./client-view-components/Create";

import { useTranslation } from "react-i18next";
import config from "config";
import qs from "query-string";
import axios from "axios";
import { thousandsDivider } from "../../../services/thousandsDivider";
import { get } from "lodash";
import { dateFormatter } from "../../../services/dateFormatter";

export default function index({ location, history }) {
	const TabPane = Tabs.TabPane;
	const [createModal, showCreateModal] = useState(false);
	const [selected, setSelected] = useState(null);
	const [page, setPage] = useState(1);
	const query = qs.parse(location.search);
	const { lang } = query;
	const [tabLang, setTabLang] = useState(lang || "ru");
	const { t } = useTranslation("main");

	const changeTab = value => {
		history.push(`/persons/client-view?lang=${value}&&id=${query.id}`);
	};

	const openEditModal = value => {
		setSelected(value);
		showCreateModal(true);
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
				<Create {...{ showCreateModal, tabLang, selected }} />
			</Modal>
			<Board className="mb-40 mt-20">
				<div className="d-flex justify-content-between align-items-center pad-10">
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
			</Board>

			<Board className="border-none">
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
					entity="customer-finance"
					name={`all`}
					url={`/customer-finance/${query.id}`}
					params={{
						extra: {
							_l: tabLang
						},
						page
					}}>
					{({ items, isFetched, meta }) => {
						return (
							<Spin spinning={!isFetched}>
								<div className="default-table pad-15">
									<Table
										hasView={true}
										rowKey="id"
										onView={value => {
											openEditModal(
												value &&
													value.order_id &&
													value.order_id
											);
										}}
										columns={[
											{
												title: t("No"),
												dataIndex: `id`,
												className:
													"text-align-left w-82",
												render: value => {
													return (
														<div className="divider-wrapper">
															{value &&
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
												title: t("Сумма"),
												dataIndex: "value",
												render: value => (
													<div className="divider-wrapper">
														{thousandsDivider(
															value && value
														)}{" "}
														{t("сум")}
													</div>
												)
											},
											{
												title: t("Дата"),
												dataIndex: "created_at",
												render: value => (
													<div className="divider-wrapper">
														{dateFormatter(
															value && value
														)}
													</div>
												)
											},
											{
												title: t("Комментария"),
												dataIndex: "comment",
												render: value => (
													<div className="divider-wrapper">
														{value && value}
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
