import React, {useState} from 'react';

import {Table, Board} from "components";
import {Pagination, Spin, Modal, notification} from "antd";
import EntityContainer from 'modules/entity/containers';
import Actions from "modules/entity/actions";

import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {helpers, time} from "services";

const List = ({history}) => {
  const [page, setPage] = useState(1);

  const {t} = useTranslation();
  const dispatch = useDispatch();

  const onDeleteHandler = menuId => {
    Modal.confirm({
      title: t("Вы действительно хотите удалить?"),
      okText: t("да"),
      okType: "danger",
      cancelText: t("нет"),
      confirmLoading: true,
      onOk: () => deleteAction(menuId),
    });
  };
  const deleteAction = id => {
    dispatch(Actions.Form.request({
      method: 'delete',
      entity: "feedback",
      name: `feedback`,
      id: id,
      url: `/feedback/${id}`,
      deleteData: true,
      primaryKey: 'id',
      cb: {
        success: () => {
          notification["success"]({
            message: t("Успешно удалена"),
            duration: 2
          });
        },
        error: () => {
          notification["error"]({
            message: t("Что-то пошло не так"),
            duration: 2
          });
        },
        finally: () => {}
      }
    }))
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-20">
        <div className="title-md">{t("Список заявок")}</div>
      </div>

      <Board className="border-none">
        <EntityContainer.All
          entity="feedback"
          name={"feedback"}
          url="/feedback"
          primaryKey="id"
          params={{
            sort: '-id',
            limit: 30,
            page,
            filter: {not: {type: 4}}

          }}
        >
          {({items, isFetched, meta}) => {
            return (
              <Spin spinning={!isFetched}>
                <div className="default-table pad-15">
                  <Table
                    hasEdit={true}
                    hasDelete={true}
                    rowKey="id"
                    onEdit={value => history.push(`/feedback/update/${value.id}`)}
                    onDelete={value => onDeleteHandler(value.id)}
                    columns={[
                      {
                        title: t("ID"),
                        dataIndex: "id",
                        className: 'w-50',
                        render: value => <div className="divider-wrapper">{value}</div>
                      },
                      {
                        title: t("Имя"),
                        dataIndex: "name",
                        render: value => <div className="divider-wrapper">{value}</div>
                      },
                      {
                        title: t("Телефон"),
                        dataIndex: "phone",
                        render: value => <div className="divider-wrapper">{value}</div>
                      },
                      {
                        title: t("Тип"),
                        dataIndex: "type",
                        render: value => <div className="divider-wrapper">{helpers.feedbackLabel(value)}</div>
                      },
                      {
                        title: t("Дата"),
                        dataIndex: "created_at",
                        render: value => <div className="divider-wrapper">{time.to(value, 'DD.MM.YYYY / HH:mm:ss')}</div>
                      },
                      {
                        title: t("Статус"),
                        dataIndex: "status",
                        className: 'text-cen w-82',
                        render: value => {
                          return <div className="divider-wrapper">
                            <div className="color-view-ellipse m-0-auto" style={{backgroundColor: value === 1 ? '#4caf50' : '#f44336'}}/>
                          </div>
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
