import React, { Component } from "react";
import {Pagination, Spin, notification, Modal} from "antd";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import qs from "query-string";
import get from "lodash/get";

import EntityContainer from "modules/entity/containers";
import EntityActions from "modules/entity/actions";
import Filter from "./components/Filter";
import { EditableTable, Board, Avatar } from "components";
import { Tooltip } from "antd";
// import {ReactComponent as DeleteIcon} from "assets/images/base/delete.svg";
import {ReactComponent as EditIcon} from "assets/images/base/edit.svg";
import Update from "./components/Update";

class List extends Component {
	state = {
		loading: false,
		selected: null,
    updateModal: false
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
    	entity: "country",
    	name: "all",
    	url: `/country/${newValue.id}`,
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
      entity: "country",
      name: "all",
      url: `/country/${id}`,
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

  openUpdateModal = (item) => {
		this.setState({
			selected: item,
      updateModal: true
		})
	};

  closeUpdateModal = () => {
  	this.setState({
			selected: null,
			updateModal: false
		})
	};



	render() {
		const { t, location } = this.props;
		const { selected, updateModal } = this.state;
		const { page } = qs.parse(location.search);

    const params = qs.parse(location.search, {ignoreQueryPrefix: true});

		return (
			<>
        <Modal
          visible={updateModal}
          onOk={() => this.openUpdateModal()}
          onCancel={() => this.closeUpdateModal()}
          footer={null}
          centered
          width={430}
          destroyOnClose
        >
          <Update {...{selected, closeUpdateModal: this.closeUpdateModal}}/>
        </Modal>

				<div className="d-flex justify-content-between align-items-center mb-20">
					<div className="title-md">{t("Список стран")}</div>
				</div>
				<Board>
					<div className="default-table pad-15">
            <Filter/>
						<EntityContainer.All
							entity="country"
							name="all"
							primaryKey="id"
							dataKey="data"
							url="/country"
              params={{
              	limit: 10,
								sort: "name",
								page,
								extra: {name: params.name},
								include: 'flag,files'
              }}>
							{({ items, isFetched, meta = {} }) => (
								<>
									<Spin spinning={!isFetched || this.state.loading}>
										<EditableTable
											pagination={false}
											onSave={this.handleSave}
                      rowKey="id"
											columns={[
												{
													title: "ID",
													dataIndex: "id"
												},
                        {
                          title: t("Флаг"),
                          dataIndex: "flag",
                          className: 'w-82 text-cen',
                          render: value => <div className="divider-wrapper">
                            <Avatar isProduct image={value}/>
                          </div>
                        },
                        {
                          title: t("Фото"),
                          dataIndex: "files",
                          className: 'w-82 text-cen',
                          render: value => <div className="divider-wrapper">
                            <Avatar isProduct isRectangle image={get(value, '[0].thumbnails.small.src')}/>
                          </div>
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
                        // {
                        //   render: (text, record) => {
                        //     return (
                        //       <Tooltip title={t("Удалить")}>
                        //         <div className="action-btn delete-btn text-cen" onClick={() => this.onDeleteHandler(record.id)}>
                        //           <DeleteIcon height={16} width={16} />
                        //         </div>
                        //       </Tooltip>
												// 		);
                        //   }
                        // },
                        {
                          render: (text, record) => {
                            return (
                              <Tooltip title={t("Изменить")}>
                                <div className="action-btn delete-btn text-cen" onClick={() => this.openUpdateModal(record)}>
                                  <EditIcon height={16} width={16} />
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
