import React from 'react';

import {Table, Board, Avatar} from "components";
import {Button, Pagination, Spin, Modal, notification} from "antd";
import EntityContainer from 'modules/entity/containers';
import Actions from "modules/entity/actions";

import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import qs from "query-string";
import Filter from "./components/Filter";
import get from "lodash/get";

const List = ({history, location}) => {
  const params = qs.parse(location.search, {ignoreQueryPrefix: true});
  const lang = useSelector(state => state.system.currentLangCode);
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const {page} = params;

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
      entity: "gallery",
      name: `galleryVideo`,
      id: id,
      url: `/galleries/${id}`,
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

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-20">
        <div className="title-md">Видеогалерея</div>
        <Button
          type="primary"
          size="large"
          className="fs-14 fw-300 ml-10"
          htmlType="button"
          onClick={() => history.push(`/gallery/video/create`)}
        >{t('Добавить')}</Button>
      </div>

      <Board>
        <Filter/>

        <EntityContainer.All
          entity="gallery"
          name={`galleryVideo`}
          url="/galleries"
          primaryKey="id"
          params={{
            sort: '-id',
            limit: 20,
            filter: {type: 2},
            extra: {title: params.title,},
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
                    onEdit={value => history.push(`/gallery/video/update/${value.id}`)}
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
                        dataIndex: "gallery",
                        className: 'w-82 text-cen',
                        render: value => <div className="divider-wrapper">
                          <Avatar isRectangle isProduct image={get(value, '[0].thumbnails.small.src')}/>
                        </div>
                      },
                      {
                        title: t("Загаловок"),
                        dataIndex: `title_${lang}`,
                        render: value => <div className="divider-wrapper">{value}</div>
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
