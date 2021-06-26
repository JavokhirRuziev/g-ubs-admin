import React, { Component } from "react";
import { Pagination, Spin, notification } from "antd";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import qs from "query-string";
import get from "lodash/get";

import EntityContainer from "modules/entity/containers";
import EntityActions from "modules/entity/actions";
import Filter from "./components/Filter";
import { EditableTable, Board } from "components";

class List extends Component {
	state = {
		loading: false
	};

	onChange = page => {
		const { history, location } = this.props;
		const query = qs.parse(location.search);
		const search = { ...query, page };

		history.push({
			search: qs.stringify(search)
		});
	};

	handleSave = ({ oldValue, newValue }) => {
		this.setState({ loading: true });
		const { t, FormRequest } = this.props;

		FormRequest({
			method: "post",
			entity: "translation",
			name: "all",
			url: "/translations/list",
			primaryKey: "id",
			id: newValue.id,
			values: newValue,
			updateData: true,
			normalizeData: data => data,
			cb: {
				success: () => {
					notification["success"]({
						message: t("Успешно"),
						duration: 2
					});
				},
				error: () => {
					notification["error"]({
						message: t("Что-то пошло не так"),
						duration: 2
					});
				},
				finally: () => {
					this.setState({ loading: false });
				}
			}
		});
	};

	render() {
		const { t, location } = this.props;
		const { page } = qs.parse(location.search);

		const params = qs.parse(location.search, { ignoreQueryPrefix: true });

		return (
			<>
				<div className="d-flex justify-content-between align-items-center mb-20">
					<div className="title-md">{t("Список переводов")}</div>
				</div>
				<Board>
					<div className="default-table pad-15">
						<Filter />
						<EntityContainer.All
							entity="translation"
							name="all"
							primaryKey="id"
							dataKey="data"
							url="/translations/list"
							params={{ limit: 10, sort: "-id", page, extra: { message: params.message } }}>
							{({ items, isFetched, meta = {} }) => (
								<>
									<Spin spinning={!isFetched || this.state.loading}>
										<EditableTable
											pagination={false}
											onSave={this.handleSave}
											columns={[
												{
													title: "ID",
													dataIndex: "id"
												},
												{
													title: t("Источник"),
													dataIndex: "message"
												},
												{
													title: t("Узбекский"),
													dataIndex: "uz",
													editable: true,
													render: (text, record) => {
														return get(record, "uz", "");
													}
												},
												{
													title: t("Русский"),
													dataIndex: "ru",
													editable: true,
													render: (text, record) => {
														return get(record, "ru", "");
													}
												}
											]}
											dataSource={items}
										/>
										<div className="table-footer">
											{isFetched && items.length > 0 && (
												<Pagination
													current={meta.currentPage}
													total={meta.totalCount}
													pageSize={meta.perPage}
													onChange={this.onChange}
												/>
											)}
											<div className="footer-actions" />
										</div>
									</Spin>
								</>
							)}
						</EntityContainer.All>
					</div>
				</Board>
			</>
		);
	}
}

const mapDispatchToProps = dispatch =>
	bindActionCreators(
		{
			FormRequest: EntityActions.Form.request
		},
		dispatch
	);

List = connect(
	null,
	mapDispatchToProps
)(List);
List = withTranslation("main")(List);

export default List;
