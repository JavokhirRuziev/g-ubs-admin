import React from "react";

import { Table, Board } from "components";
import { Pagination, Spin, Tag } from "antd";
import EntityContainer from "modules/entity/containers";
import { helpers } from "services";
import Filter from "./Filter";
import qs from "query-string";

import { useTranslation } from "react-i18next";
import get from "lodash/get";
import variables from "../../variables";

const Index = ({location, history}) => {
	const { t } = useTranslation();
	const params = qs.parse(location.search, {ignoreQueryPrefix: true});

	const page = params.page;
	const setPage = (page) => {
		history.push({
			search: qs.stringify({...params, page}, {encode: false})
		})
	}

	return (
		<>
			<div className="d-flex justify-content-between align-items-center mb-20">
				<div className="title-md">{t("Заказы")}</div>
			</div>

			<Board className="border-none">
				<Filter/>

				<EntityContainer.All
					entity="order"
					name={`all`}
					url="/dashboard/orders"
					params={{
						limit: 50,
						include: "user,waiter,payments",
						page: page ? page : 1,
						filter: {
							status: params.status && params.status,
							type: params.type && params.type,
						},
						extra: {
							start_date: params.start_at && params.start_at,
							end_date: params.end_at && params.end_at
						}
					}}
				>
					{({ items, isFetched, meta }) => {
						const currentPage = get(meta, 'currentPage');
						const perPage = get(meta, 'perPage');
						return (
							<Spin spinning={!isFetched}>
								<div className="default-table pad-15">
									<Table
										rowKey="id"
										columns={[
											{
												title: "№",
												className: "w-100",
												render: (value,row,index) => {
													const a = Number(currentPage-1)*Number(perPage);
													const n = currentPage > 1 ? a+index+1 : index+1
													return (
														<div className="divider-wrapper">{n}</div>
													)
												}
											},
											{
												title: "Заказ - ID",
												dataIndex: "id",
												className: "w-100",
												render: value => <div className="divider-wrapper">{value}</div>
											},
											{
												title: "Дата",
												dataIndex: "created_at",
												className: "",
												render: value => <div className="divider-wrapper">
													{helpers.formatDate(value, "HH:mm / DD.MM.YYYY")}
												</div>
											},
											{
												title: "Тип",
												dataIndex: "type",
												className: "",
												render: value => <div className="divider-wrapper">
													{helpers.getOrderType(value)}
												</div>
											},
											{
												title: "Официант",
												dataIndex: "waiter",
												className: "",
												render: value => <div className="divider-wrapper">
													{value ? get(value, 'to_user.name') : '-'}
												</div>
											},
											{
												title: "Клиент",
												dataIndex: "user",
												className: "",
												render: value => <div className="divider-wrapper">
													{get(value, "phone")}
												</div>
											},
											{
												title: "Цена доставки",
												dataIndex: "delivery_price",
												className: "",
												render: (value,row) => <div className="divider-wrapper">
													{row.type === variables.TYPE_DELIVERY ? <span>{value ? value.toLocaleString() : '-'}</span> : '-'}
												</div>
											},
											{
												title: "Цена обслуги",
												dataIndex: "tip_price",
												className: "",
												render: (value) => <div className="divider-wrapper">
													<span>{value ? value.toLocaleString() : '-'}</span>
												</div>
											},
											{
												title: "Тип оплаты",
												dataIndex: "payments",
												className: "",
												render: value => <div className="divider-wrapper">
													{(Array.isArray(value) && value.length > 0) ? (
														value.map(v => (
															<div className="d-flex">
																<span>{helpers.getPaymentType(v.payment_type)}</span>
																<span className="ml-10" style={{opacity: '.6'}}>{v.amount.toLocaleString()}</span>
															</div>
														))
													) : '-'}
												</div>
											},
											{
												title: "Цена",
												dataIndex: "total_sum",
												className: "",
												render: value => <div className="divider-wrapper">
													{value ? value.toLocaleString() : "-"}
												</div>
											},
											{
												title: "Статус",
												dataIndex: "status",
												className: "",
												render: value => <div className="divider-wrapper">
													<Tag
														color={helpers.getOrderStatus(value).color}>{helpers.getOrderStatus(value).label}</Tag>
												</div>
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
											onChange={newPage => setPage(newPage)}
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