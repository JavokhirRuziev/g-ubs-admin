import React, {useState} from 'react';

import {Table, Board, Avatar} from "components";
import {Button, Pagination, Spin, Tabs, Modal, notification} from "antd";
import EntityContainer from 'modules/entity/containers';
import Actions from "modules/entity/actions";

import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";

import config from "config";
import qs from "query-string";
import get from "lodash/get";

const List = ({history, location}) => {
  const query = qs.parse(location.search);
  const {lang} = query;

  const [tabLang, setTabLang] = useState(lang ? lang : 'ru');
  const [page, setPage] = useState(1);

  const {t} = useTranslation("");
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
      entity: "dishes",
      name: `all-${tabLang}`,
      id: id,
      url: `/dishes/${id}`,
      deleteData: true,
      primaryKey: 'id',
      params: {
       extra: { _l: tabLang }
      },
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

  const TabPane = Tabs.TabPane;
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-20">
        <div className="title-md">{t("Еды")}</div>
        <Button
          type="primary"
          size="large"
          className="fs-14 fw-300 ml-10"
          htmlType="button"
          onClick={() => history.push(`/dishes/create?lang=${tabLang}`)}
        >{t('Добавить')}</Button>
      </div>

      <Board className="border-none">
        <div>
          <Tabs
            activeKey={tabLang}
            onChange={value => setTabLang(value)}
            className="tabs--board-head"
          >
            {config.API_LANGUAGES.map(item => (
              <TabPane key={item.code} tab={t(item.title)} />
            ))}
          </Tabs>
        </div>
        <EntityContainer.All
          entity="dishes"
          name={`all-${tabLang}`}
          url="/dishes"
          primaryKey="id"
          params={{
            sort: '-id',
            limit: 50,
            include: 'translate,file,unit',
            extra: {_l: tabLang},
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
                    onEdit={value => history.push(`/dishes/update/${value.id}?lang=${tabLang}`)}
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
                        dataIndex: "translate.name",
                        className: "min-w-200",
                        render: value => <div className="divider-wrapper">{value ? value : '-'}</div>
                      },
                      {
                        title: t("Ед изм"),
                        dataIndex: "unit",
                        render: value => <div className="divider-wrapper">{value ? get(value, 'title_ru') : '-'}</div>
                      },
                      {
                        title: t("Цена"),
                        dataIndex: "price",
                        render: value => <div className="divider-wrapper">{value ? value : '-'}</div>
                      },
                      {
                        title: t("Кол-во"),
                        dataIndex: "quantity",
                        render: value => <div className="divider-wrapper">{value ? value : 0}</div>
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