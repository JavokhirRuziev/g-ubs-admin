import React, {useState} from 'react';

import {Table, Board} from "components";
import {Button, Pagination, Spin, Tabs, Modal, notification} from "antd";
import EntityContainer from 'modules/entity/containers';
import Actions from "modules/entity/actions";

import {useTranslation} from "react-i18next";
import {useSelector, useDispatch} from "react-redux";

import config from "config";

const List = ({history}) => {
  const langCode = useSelector(state => state.system.currentLangCode);

  const [tabLang, setTabLang] = useState(langCode);
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
      entity: "setting",
      name: `settings-${tabLang}`,
      id: id,
      url: `/settings/${id}`,
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
        <div className="title-md">{t("Список настройки")}</div>
        <Button
          type="primary"
          size="large"
          className="fs-14 fw-300 ml-10"
          htmlType="button"
          onClick={() => history.push(`/settings/create?lang=${tabLang}`)}
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
          entity="setting"
          name={`settings-${tabLang}`}
          url="/settings"
          primaryKey="id"
          params={{
            sort: '-id',
            limit: 10,
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
                    hasDelete={false}
                    rowKey="id"
                    onEdit={value => history.push(`/settings/update/${value.id}?lang=${tabLang}`)}
                    onDelete={value => onDeleteHandler(value.id)}
                    columns={[
                      {
                        title: t("ID"),
                        dataIndex: "id",
                        className: 'w-50',
                        render: value => <div className="divider-wrapper">{value}</div>
                      },
                      {
                        title: t("Загаловок"),
                        dataIndex: "name",
                        render: value => <div className="divider-wrapper">{value}</div>
                      },
                      {
                        title: t("Слуг"),
                        dataIndex: "slug",
                        render: value => <div className="divider-wrapper">{value}</div>
                      },
                      {
                        title: t("Алиас"),
                        dataIndex: "alias",
                        render: value => <div className="divider-wrapper">{value ? value : 'нет'}</div>
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