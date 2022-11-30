import React, { useEffect, useState } from "react";

import { Table, Board } from "components";
import { Modal, Pagination, Spin, Tag } from "antd";
import EntityContainer from "modules/entity/containers";
import { helpers } from "services";
import Filter from "./Filter";
import qs from "query-string";

import { useTranslation } from "react-i18next";
import "../Dashboard/style.scss";
import { useSelector } from "react-redux";
import MobFilter from "./MobFilter";
import ViewModal from "./components/viewModal"
import OrdersModal from "./components/ordersModal";
import {time} from "../../services";

const Index = ({location, history}) => {
	const {t} = useTranslation("main");
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [selected, setSelected] = useState(null);
	const [viewModal, showViewModal] = useState(false);
	const [ordersModal, showOrdersModal] = useState(false);
	const [filterModal, showFilterModal] = useState(false);
	const params = qs.parse(location.search, {ignoreQueryPrefix: true});
	const windowWidth = useSelector(state => state.system.width);

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

			<Modal
				visible={viewModal}
				onCancel={() => showViewModal(false)}
				footer={null}
				centered
				width={700}
				destroyOnClose
			>
				<ViewModal {...{selected: selectedOrder, showViewModal}}/>
			</Modal>

			<Modal
				visible={ordersModal}
				onCancel={() => showOrdersModal(false)}
				footer={null}
				centered
				width={600}
				destroyOnClose
			>
				<OrdersModal {...{selected, showViewModal, setSelectedOrder}}/>
			</Modal>

			<Board className="border-none mb-30">
				{(windowWidth > 1250) ? (
					<Filter/>
				) : (
					<MobFilter {...{filterModal, showFilterModal}}/>
				)}

				<EntityContainer.All
					entity="ordersOnTable"
					name={`all`}
					primaryKey={'closed_at'}
					url="/dashboard/table-monitoring"
					params={{
						limit: 100,
						page: page ? page : 1,
						extra: {
							start_date: params.start_at && params.start_at,
							end_date: params.end_at && params.end_at,
							number: params.table_number && params.table_number
						}
					}}
				>
					{({ items, isFetched, meta }) => {
						return (
							<Spin spinning={!isFetched}>
								<div className="default-table pad-15">
									<Table
										rowKey="closed_at"
										columns={[
											{
												title: t('Номер стола'),
												dataIndex: "number",
												className: "w-200",
												render: value => <div className="divider-wrapper">{value}</div>
											},
											{
												title: t("Дата"),
												dataIndex: "closed_at",
												className: "w-200",
												render: value => <div className="divider-wrapper">{time.to(value, 'DD.MM.YYYY / HH:mm')}</div>
											},
											{
												title: t("Сумма обслуги"),
												className: "w-200",
												dataIndex: "tip_price",
												render: value => <div className="divider-wrapper">{value ? helpers.convertToReadable(value) : '0'}</div>
											},
											{
												title: t("Сумма блюд"),
												className: "w-200",
												dataIndex: "total_price",
												render: value => <div className="divider-wrapper">{value ? helpers.convertToReadable(value) : '0'}</div>
											},
											{
												title: t("Сумма"),
												className: "w-200",
												dataIndex: "total_sum",
												render: value => <div className="divider-wrapper">{value ? helpers.convertToReadable(value) : '0'}</div>
											},
											{
												title: t("Заказы"),
												dataIndex: "orders",
												render: (value,row) => <div className="divider-wrapper">
													<div className='cr-blue cursor-pointer' onClick={() => {
														showOrdersModal(true)
														setSelected(row)
													}}>{t("Посмотреть заказы")}</div>
												</div>
											},
										]}
										dataSource={items}
									/>
								</div>
								{meta && meta.perPage && (
									<div className="pagination-foot-buttons">
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