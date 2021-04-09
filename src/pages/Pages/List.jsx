import React, {useState} from 'react';

import {Table, Board, Avatar} from "components";
import {CopyToClipboard} from "components/SmallComponents";
import {Button, Pagination, Spin, Tabs, Modal, notification} from "antd";
import EntityContainer from 'modules/entity/containers';
import Actions from "modules/entity/actions";

import {useTranslation} from "react-i18next";
import {useSelector, useDispatch} from "react-redux";

import config from "config";
import get from "lodash/get";
import qs from "query-string";
import Filter from "./components/Filter";

const List = ({history, location}) => {
  const langCode = useSelector(state => state.system.currentLangCode);
  const params = qs.parse(location.search, {ignoreQueryPrefix: true});
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const {lang, page} = params;
  const [tabLang, setTabLang] = useState(lang || langCode);

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
      entity: "page",
      name: `pages-${tabLang}`,
      id: id,
      url: `/pages/${id}`,
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

  const onChange = page => {
    const search = { ...params, page };

    history.push({
      search: qs.stringify(search)
    });
  };

  const TabPane = Tabs.TabPane;
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-20">
        <div className="title-md">{t("Список страниц")}</div>
        <Button
          type="primary"
          size="large"
          className="fs-14 fw-300 ml-10"
          htmlType="button"
          onClick={() => history.push(`/pages/create?lang=${tabLang}`)}
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

        <Filter/>

        <EntityContainer.All
          entity="page"
          name={`pages-${tabLang}`}
          url="/pages"
          primaryKey="id"
          params={{
            sort: '-id',
            limit: 20,
            extra: {_l: tabLang, name: params.title,},
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
                    onEdit={value => history.push(`/pages/update/${value.id}?lang=${tabLang}`)}
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
                        dataIndex: "title",
                        render: value => <div className="divider-wrapper">{value}</div>
                      },
                      {
                        title: t("Ссылька"),
                        dataIndex: "slug",
                        render: value => <div className="divider-wrapper">
                          <CopyToClipboard str={`/pages/${value}`}/>
                        </div>
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
