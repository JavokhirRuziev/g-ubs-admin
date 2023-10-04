import React, {useState} from 'react';

import {useParams} from "react-router";
import {useTranslation} from "react-i18next";
import {ReactComponent as PlusIcon} from "assets/images/icons/plus.svg";

import {Button, Modal, notification, Spin} from "antd";
import Actions from "modules/entity/actions";
import Create from "./IngredientsCreate";
import Update from "./IngredientsUpdate";
import {useDispatch} from "react-redux";
import {Table} from "components";
import EntityContainer from "modules/entity/containers";

const Ingredients = () => {
    const {t} = useTranslation("main");
    const params = useParams();
    const dispatch = useDispatch();

    const {id} = params;
    const [createModal, showCreateModal] = useState(false);
    const [updateModal, showUpdateModal] = useState(false);
    const [selected, setSelected] = useState(null);

    const onDeleteHandler = productId => {
        Modal.confirm({
            title: t("Вы действительно хотите удалить?"),
            okText: t("да"),
            okType: "danger",
            cancelText: t("нет"),
            confirmLoading: true,
            onOk: () => deleteAction(productId),
        });
    };
    const deleteAction = productId => {
        dispatch(Actions.Form.request({
            method: 'delete',
            entity: "ingredients",
            name: `all-${id}`,
            id: productId,
            url: `/ingredients/${productId}`,
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
                finally: () => {
                }
            }
        }))
    };
    const openEditModal = value => {
        setSelected(value);
        showUpdateModal(true);
    };
    return (
        <div className="mt-30">
            <Modal
                visible={createModal}
                onOk={() => showCreateModal(true)}
                onCancel={() => showCreateModal(false)}
                footer={null}
                centered
                width={400}
                destroyOnClose
            >
                <Create {...{showCreateModal, parent_id: id}}/>
            </Modal>
            <Modal
                visible={updateModal}
                onOk={() => showUpdateModal(true)}
                onCancel={() => showUpdateModal(false)}
                footer={null}
                centered
                width={400}
                destroyOnClose
            >
                <Update {...{selected, showUpdateModal, parent_id: id}}/>
            </Modal>

            <div className="d-flex align-items-center justify-content-between mb-20">
                <div className="ant-label">{t("Ингредиенты")}</div>
                <Button
                    type="primary"
                    size="large"
                    className="fs-14 fw-300 btn-with-icon"
                    htmlType="button"
                    onClick={() => showCreateModal(true)}
                ><PlusIcon className={"mr-0"}/></Button>
            </div>

            <EntityContainer.All
                entity="ingredients"
                name={`all-${id}`}
                url="/ingredients"
                params={{
                    filter: {dish_id: id},
                    sort: '-id',
                    limit: 100,
                }}
            >
                {({items, isFetched, meta}) => {
                    return (
                        <Spin spinning={!isFetched}>
                            <div className="default-table default-table--wb">
                                <Table
                                    hasDelete={true}
                                    hasEdit={true}
                                    rowKey="id"
                                    onDelete={value => onDeleteHandler(value.id)}
                                    onEdit={value => openEditModal(value)}
                                    columns={[
                                        {
                                            title: t("Названия"),
                                            dataIndex: `title_ru`,
                                            render: value => <div className="divider-wrapper">{value ? value : '-'}</div>
                                        },
                                        {
                                            title: t("Цена"),
                                            dataIndex: `price`,
                                            render: value => <div className="divider-wrapper">{value ? value : '-'}</div>
                                        },
                                        {
                                            title: t("Статус"),
                                            dataIndex: "status",
                                            className: 'text-cen w-82',
                                            render: (value) => {
                                                return <div className="divider-wrapper">
                                                    <div className="color-view-ellipse m-0-auto" style={{backgroundColor: value === 1 ? '#4caf50' : '#f44336'}}/>
                                                </div>
                                            }
                                        }
                                    ]}
                                    dataSource={items}
                                />
                            </div>
                        </Spin>
                    );
                }}
            </EntityContainer.All>

        </div>
    );
};

export default Ingredients;
