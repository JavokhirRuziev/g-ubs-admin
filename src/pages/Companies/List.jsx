import React, { useState } from "react";

import { Table, Board, Avatar } from "components";
import {CopyToClipboard} from "components/SmallComponents";
import { Pagination, Spin, Tabs } from "antd";
import EntityContainer from "modules/entity/containers";

import { useTranslation } from "react-i18next";
import get from "lodash/get";

import config from "config";
import qs from "query-string";

const List = ({ location, history }) => {
	const query = qs.parse(location.search);
	const { lang } = query;

	const [tabLang, setTabLang] = useState(lang ? lang : "ru");
	const [page, setPage] = useState(1);

	const { t } = useTranslation();
	const TabPane = Tabs.TabPane;

	return (
		<>
			<div className="d-flex justify-content-between align-items-center mb-20">
				<div className="title-md">{t("Компании")}</div>
			</div>

			<Board className="border-none">
				<div>
					<Tabs
						activeKey={tabLang}
						onChange={value => setTabLang(value)}
						className="tabs--board-head"
					>
						{config.API_LANGUAGES.map(item => (
							<TabPane key={item.code} tab={t(item.title)} />
						))}
					</Tabs>
				</div>
				<EntityContainer.All
					entity="company"
					name={`all-${tabLang}`}
					url="/companies"
					primaryKey="id"
					params={{
						sort: "-id",
						limit: 50,
						include: "translate",
						extra: { _l: tabLang },
						page
					}}
				>
					{({ items, isFetched, meta }) => {
						return (
							<Spin spinning={!isFetched}>
								<div className="default-table pad-15">
									<Table
										rowKey="id"
										hasEdit={true}
										onEdit={row => {
											history.push(`/companies/view/${row.id}?lang=${tabLang}`);
										}}
										columns={[
											{
												title: t("ID"),
												dataIndex: "id",
												className: "w-50 cursor-pointer",
												render: value => <div className="divider-wrapper">{value}</div>
											},
											{
												title: t("Фото"),
												dataIndex: "file",
												className: "w-82 text-cen cursor-pointer",
												render: value => <div className="divider-wrapper">
													<Avatar isRectangle isProduct
															image={get(value, "thumbnails.small.src")} />
												</div>
											},
											{
												title: t("Загаловок"),
												className: "cursor-pointer",
												dataIndex: "translate",
												render: value => <div
													className="divider-wrapper">{get(value, "name", "-")}</div>
											},
											{
												title: t("Ссылька"),
												dataIndex: "",
												render: (value,row) => <div className="divider-wrapper">
													<CopyToClipboard str={`/companies/${row.id}`} />
												</div>
											},

											{
												title: t("Статус"),
												dataIndex: "status",
												className: "text-cen w-82 cursor-pointer",
												render: value => {
													return <div className="divider-wrapper">
														<div className="color-view-ellipse m-0-auto"
															 style={{ backgroundColor: value === 1 ? "#4caf50" : "#f44336" }} />
													</div>;
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
											onChange={setPage}
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

export default List;