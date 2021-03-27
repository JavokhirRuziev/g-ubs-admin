import React, {useState} from 'react';

import {Table, Board, Avatar} from "components";
import {Button, Pagination, Spin, Modal, notification} from "antd";
import EntityContainer from 'modules/entity/containers';
import Actions from "modules/entity/actions";
import Filter from "./components/Filter";

import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import get from "lodash/get";
import qs from "query-string";
import Import from "./components/Import";
import {ReactComponent as PlusIcon} from "../../assets/images/icons/plus.svg";

const List = ({history, location}) => {
  const params = qs.parse(location.search, {ignoreQueryPrefix: true});
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {page} = params;
  const [importModal, showImportModal] = useState(false);
  const [canUpdate, setCanUpdate] = useState(false);

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
      entity: "product",
      name: `products`,
      id: id,
      url: `/products/${id}`,
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

  const onChange = page => {
    const search = { ...params, page };

    history.push({
      search: qs.stringify(search)
    });
  };

  const successCbImport = () => {
    onChange(1);
    setCanUpdate(!canUpdate)
  }

  return (
    <>
      <Modal
          visible={importModal}
          onOk={() => showImportModal(true)}
          onCancel={() => showImportModal(false)}
          footer={null}
          centered
          width={430}
          destroyOnClose
      >
        <Import {...{showImportModal, successCbImport}}/>
      </Modal>

      <div className="d-flex justify-content-between align-items-center mb-20">
        <div className="title-md">{t("Список товаров")}</div>

        <div className="d-flex">
          <Button
              size="large"
              className="fs-14 fw-300 btn-with-icon"
              htmlType="submit"
              onClick={() => showImportModal(true)}
          ><PlusIcon/> {t("Импорт")}</Button>
          <Button
              type="primary"
              size="large"
              className="fs-14 fw-300 ml-10"
              htmlType="button"
              onClick={() => history.push(`/products/create`)}
          >{t('Добавить')}</Button>
        </div>
      </div>

      <Board className="border-none">
        <Filter lang={"ru"}/>

        <EntityContainer.All
          entity="product"
          name={`products`}
          url="/products"
          primaryKey="id"
          params={{
            sort: '-id',
            limit: 30,
            include: 'category',
            filter: {
              category_id: params.category ? Number(params.category.split('/')[0]) : ''
            },
            extra: {name: params.name},
            page
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
                    onEdit={value => history.push(`/products/update/${value.id}`)}
                    onDelete={value => onDeleteHandler(value.id)}
                    columns={[
                      {
                        title: t("ID"),
                        dataIndex: "id",
                        className: 'w-50',
                        render: value => <div className="divider-wrapper">{value}</div>
                      },
                      {
                        title: t("Фото"),
                        dataIndex: "file",
                        className: 'w-82 text-cen',
                        render: value => <div className="divider-wrapper">
                          <Avatar isRectangle isProduct image={get(value, 'thumbnails.small.src')}/>
                        </div>
                      },
                      {
                        title: t("Загаловок"),
                        dataIndex: "name_ru",
                        render: value => <div className="divider-wrapper">{value}</div>
                      },
                      {
                        title: t("Цена"),
                        dataIndex: "price",
                        render: value => <div className="divider-wrapper">{value ? value : '-'}</div>
                      },
                      {
                        title: t("Категория"),
                        dataIndex: "category",
                        render: value => {
                          return <div className="divider-wrapper">{value ? get(value, `name_ru`) : '-'}</div>
                        }
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
                      onChange={onChange}
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