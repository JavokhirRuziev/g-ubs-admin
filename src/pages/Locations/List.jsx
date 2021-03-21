import React, {useEffect, useState} from 'react';

import {Table, Board } from "components";
import {Button, Pagination, Spin, Modal, notification} from "antd";
import EntityContainer from 'modules/entity/containers';
import Actions from "modules/entity/actions";
import {useTranslation} from "react-i18next";
import {useSelector, useDispatch} from "react-redux";
import qs from "query-string";
import Filter from "./components/Filter";

const List = ({history, location}) => {


  const langCode = useSelector(state => state.system.currentLangCode);
  const [tabLang, setTabLang] = useState(langCode);
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
      entity: "locations",
      name: `locations`,
      id: id,
      url: `/shops/${id}`,
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

  const params = qs.parse(location.search, {ignoreQueryPrefix: true});


  const onChange = page => {
    const query = qs.parse(location.search);
    const search = {...query, page};
    history.push({
      search: qs.stringify(search)
    });
  };
  const {page = 1, lang} = qs.parse(location.search);


  useEffect(()=> {
    if (lang){
      setTabLang(lang)
    }
  }, []);
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-20">
        <div className="title-md">{t('Локации')}</div>
        <Button
          type="primary"
          size="large"
          className="fs-14 fw-300 ml-10"
          htmlType="button"
          onClick={() => history.push(`/locations/create?lang=${tabLang}&page=${page}`)}
        >{t('Добавить')}</Button>
      </div>


      <Board className="border-none">
        <Filter/>
        <EntityContainer.All
          entity="locations"
          name={`locations`}
          url="/shops"
          primaryKey="id"
          params={{
            sort: '-id',
            limit: 10,
            extra: {
              title: params.title
            },
            filter: {
              status: params.status,
            },
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
                    onEdit={value => history.push(`/locations/update/${value.id}?lang=${tabLang}&page=${page}`)}
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
                        dataIndex: `title_${tabLang}`,
                        render: value => <div className="divider-wrapper">{value}</div>
                      },
                      {
                        title: t("Телефон"),
                        dataIndex: "phone",
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