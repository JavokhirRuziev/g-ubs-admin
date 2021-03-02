import React, { Component } from "react";
import {Pagination, Spin, notification, Tooltip, Modal} from "antd";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import qs from "query-string";
import get from "lodash/get";

import EntityContainer from "modules/entity/containers";
import EntityActions from "modules/entity/actions";
import Filter from "./components/Filter";
import { EditableTable, Board } from "components";
import {ReactComponent as DeleteIcon} from "assets/images/base/delete.svg";

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

		let val = {[newValue.language]: newValue.translation};

    FormRequest({
    	method: "put",
    	entity: "region",
    	name: "all",
    	url: `/region/${newValue.id}`,
    	primaryKey: "id",
    	id: newValue.id,
    	values: val,
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

  onDeleteHandler = id => {
    const { t } = this.props;
    Modal.confirm({
      title: t("Вы действительно хотите удалить?"),
      okText: t("да"),
      okType: "danger",
      cancelText: t("нет"),
      confirmLoading: true,
      onOk: () => this.deleteAction(id),
    });
  };

  deleteAction = id => {
    this.setState({ loading: true });
    const { t, FormRequest } = this.props;

    FormRequest({
      method: "delete",
      entity: "region",
      name: "all",
      url: `/region/${id}`,
      primaryKey: "id",
      id: id,
      deleteData: true,
      cb: {
        success: () => {
          notification["success"]({
            message: t("Успешно удалено"),
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

    const params = qs.parse(location.search, {ignoreQueryPrefix: true});
		return (
			<>
				<div className="d-flex justify-content-between align-items-center mb-20">
					<div className="title-md">{t("Список город")}</div>
				</div>
				<Board>
					<div className="default-table pad-15">
            <Filter/>
						<EntityContainer.All
							entity="region"
							name="all"
							primaryKey="id"
							dataKey="data"
							url="/region"
              params={{
              	limit: 10,
								sort: "-id",
								page,
								extra: {name: params.name},
								filter: {country_id: params.country ? params.country.split('/')[0] : null}
              }}>
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
													title: t("Названия"),
													dataIndex: "name"
												},
												{
													title: t("Лотин алифбосида"),
													dataIndex: "name_uz",
													editable: true,
													render: (text, record) => {
														return get(record, "name_uz", "");
													}
												},
												{
													title: t("На русском языке"),
													dataIndex: "name_ru",
													editable: true,
													render: (text, record) => {
														return get(record, "name_ru", "");
													}
												},
												{
													title: t("In English"),
													dataIndex: "name_en",
													editable: true,
													render: (text, record) => {
														return get(record, "name_en", "");
													}
												},
                        {
                          render: (text, record) => {
                            return (
                              <Tooltip title={t("Удалить")}>
                                <div className="action-btn delete-btn text-cen" onClick={() => this.onDeleteHandler(record.id)}>
                                  <DeleteIcon height={16} width={16} />
                                </div>
                              </Tooltip>
                            );
                          }
                        },
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
