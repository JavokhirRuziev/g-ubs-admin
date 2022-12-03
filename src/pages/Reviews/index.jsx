import React, {useState} from 'react';

import {Table, Board} from "components";
import {Pagination, Spin, Modal} from "antd";
import EntityContainer from 'modules/entity/containers';
import Update from "./components/Update";

import {useTranslation} from "react-i18next";
import get from "lodash/get";

const Index = () => {
  const [updateModal, showUpdateModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);

  const {t} = useTranslation("main");

  const openEditModal = value => {
    setSelected(value);
    showUpdateModal(true);
  };

  return (
    <>
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
        <div className="title-md">{t("Отзывы")}</div>
      </div>

      <Board className="border-none">
        <EntityContainer.All
          entity="review"
          name={`all`}
          url="/reviews"
          params={{
            limit: 50,
            page,
            include: 'user,company',
            sort: '-id'
          }}
        >
          {({items, isFetched, meta}) => {
            return (
              <Spin spinning={!isFetched}>
                <div className="default-table pad-15">
                  <Table
                    hasEdit={true}
                    rowKey="id"
                    onEdit={value => openEditModal(value)}
                    columns={[
                      {
                        title: t("ID"),
                        dataIndex: "id",
                        className: 'w-50',
                        render: value => <div className="divider-wrapper">{value}</div>
                      },
                      {
                        title: t("Имя пользователя"),
                        dataIndex: "user",
                        render: value => <div className="divider-wrapper">{get(value, 'name', '')}</div>
                      },
                      {
                        title: t("Комрания"),
                        dataIndex: "company",
                        render: value => <div className="divider-wrapper">{get(value, 'translate.name', '')}</div>
                      },
                      {
                        title: t("Оценка заведение"),
                        dataIndex: "rate_institution",
                        render: value => <div className="divider-wrapper">
                          {value ? (
                              [...Array(Number(value))].map(i => (
                                  <img src={require("assets/images/icons/icon-star.svg")} alt="" key={i} className="--star-icon"/>
                              ))
                          ) : ('-')}
                        </div>
                      },
                      {
                        title: t("Оценка блюда"),
                        dataIndex: "rate_dish",
                        render: value => <div className="divider-wrapper">
                          {value ? (
                              [...Array(Number(value))].map(i => (
                                  <img src={require("assets/images/icons/icon-star.svg")} alt="" key={i} className="--star-icon"/>
                              ))
                          ) : ('-')}
                        </div>
                      },
                      {
                        title: t("Оцените обслуживание"),
                        dataIndex: "rate_service",
                        render: value => <div className="divider-wrapper">
                          {value ? (
                              [...Array(Number(value))].map(i => (
                                  <img src={require("assets/images/icons/icon-star.svg")} alt="" key={i} className="--star-icon"/>
                              ))
                          ) : ('-')}
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

export default Index;