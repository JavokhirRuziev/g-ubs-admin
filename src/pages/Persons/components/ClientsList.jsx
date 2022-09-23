import React, { useState } from "react";
import EntityContainer from "modules/entity/containers";
import { Pagination, Spin, Modal } from "antd";
import { Table } from "components";
import { useHistory, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import qs from "query-string";
import UpdateClient from "./UpdateClient";
import { Link } from "react-router-dom";
import {helpers} from "../../../services";

let content = document.querySelector(".m-content");

const ClientsList = ({ searchQuery, type }) => {

	const { t } = useTranslation();
	const location = useLocation();
	const history = useHistory();
	const [updateModal, showUpdateModal] = useState(false);
	const [selected, setSelected] = useState(null);

	const { page } = qs.parse(location.search);

	const setPage = page => {
		const query = qs.parse(location.search);
		const search = { ...query, page };

		history.push({
			search: qs.stringify(search)
		});

		if (content) {
			content.scrollTo({
				behavior: "smooth",
				top: 0,
				left: 0
			})
		}
	};

	return (
		<EntityContainer.All
			entity="person"
			name={`type-${type}`}
			url="/customers"
			primaryKey="id"
			params={{
				limit: 50,
				filter: {type: type},
				page,
				extra: { append: 'balance', name: searchQuery },
			}}
		>
			{({ items, isFetched, meta }) => {
				return (
					<Spin spinning={!isFetched}>
						<Modal
							visible={updateModal}
							onOk={() => showUpdateModal(true)}
							onCancel={() => showUpdateModal(false)}
							footer={null}
							centered
							width={500}
							destroyOnClose
						>
							<UpdateClient {...{
								showUpdateModal,
								selected
							}} />
						</Modal>

						<div className="default-table pad-15">
							<Table
								hasEdit={true}
								onEdit={(value) => {
									setSelected(value);
									showUpdateModal(true);
								}}
								rowKey={"id"}
								columns={[
									{
										title: t("ID"),
										dataIndex: "id",
										className: "w-50 text-cen",
										render: value => <div className="divider-wrapper">{value}</div>
									},
									{
										title: t("Имя"),
										dataIndex: "name",
										render: (value, row) => <div className="divider-wrapper fw-700">
											<Link className={'cr-blue'} to={`/customers/transactions/${row.id}`}>{value ? value : '-'}</Link>
										</div>
									},
									{
										title: t("Тел. номер"),
										dataIndex: "phone",
										className: "text-cen",
										render: value => <div className="divider-wrapper">
											{value ? value : t("нет номера")}
										</div>
									},
									{
										title: t("Баланс сум"),
										dataIndex: "balance",
										className: "",
										render: (value) => {
											return (
												<div
													className="divider-wrapper fw-700">
													{value >= 0 ? (
														<span style={{color: 'green'}}>
															{value ? helpers.convertToReadable(value) : 0}
														</span>
													) : (
														<span style={{color: 'red'}}>{value ? helpers.convertToReadable(value) : 0}</span>
													)}

												</div>
											);
										}
									},
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
	);
};

export default ClientsList;
