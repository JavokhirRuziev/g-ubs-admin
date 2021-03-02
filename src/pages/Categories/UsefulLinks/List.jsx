import React, {useState} from 'react';

import {Table, Board} from "components";
import {Button, Pagination, Spin, Modal, notification} from "antd";
import EntityContainer from 'modules/entity/containers';
import Create from "./components/Create";
import Update from "./components/Update";
import Actions from "modules/entity/actions";

import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import orderBy from "lodash/orderBy";

const List = () => {
  const lang = useSelector(state => state.system.currentLangCode);

  const [createModal, showCreateModal] = useState(false);
  const [updateModal, showUpdateModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);

  const {t} = useTranslation();
  const dispatch = useDispatch();

  const openEditModal = value => {
    setSelected(value);
    showUpdateModal(true);
  };

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
      entity: "category",
      name: `categoryUseful`,
      id: id,
      url: `/useful-links-category/${id}`,
      deleteData: true,
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

  const type = (type) => {
    switch (type) {
      case 1:
        return t("По умалчанию");
      case 2:
        return t("Актуальный");
      case 3:
        return t("Топ");
      default:
        return "";
    }
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
        destroyOnClose
      >
        <Create {...{showCreateModal}}/>
      </Modal>
      <Modal
        visible={updateModal}
        onOk={() => showUpdateModal(true)}
        onCancel={() => showUpdateModal(false)}
        footer={null}
        centered
        width={430}
        destroyOnClose
      >
        <Update {...{selected, showUpdateModal}}/>
      </Modal>

      <div className="d-flex justify-content-between align-items-center mb-20">
        <div className="title-md">{t("Категория полезные ссыльки")}</div>
        <Button
          type="primary"
          size="large"
          className="fs-14 fw-300 ml-10"
          htmlType="button"
          onClick={() => showCreateModal(true)}
        >{t('Добавить')}</Button>
      </div>

      <Board>
        <EntityContainer.All
          entity="category"
          name={`categoryUseful`}
          url="/useful-links-category"
          params={{
            sort: 'type',
            limit: 10,
            page
          }}
        >
          {({items, isFetched, meta}) => {
           const orderedItems =  orderBy(items, ['type', 'sort'], ['asc', 'asc']);
            return (
              <Spin spinning={!isFetched}>
                <div className="default-table pad-15">
                  <Table
                    hasEdit={true}
                    hasDelete={true}
                    rowKey="id"
                    onEdit={value => openEditModal(value)}
                    onDelete={value => onDeleteHandler(value.id)}
                    columns={[
                      {
                        title: t("ID"),
                        dataIndex: "id",
                        className: 'w-50',
                        render: value => <div className="divider-wrapper">{value}</div>
                      },
                      {
                        title: t("Название"),
                        dataIndex: `name_${lang}`,
                        render: value => <div className="divider-wrapper">{value}</div>
                      },
                      {
                        title: t("Типь"),
                        dataIndex: "type",
                        render: value => <div className="divider-wrapper">{type(value)}</div>
                      },
                      {
                        title: t("Сортировка"),
                        dataIndex: "sort",
                        render: value => <div className="divider-wrapper">{value}</div>
                      }
                    ]}
                    dataSource={orderedItems}
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

export default List;