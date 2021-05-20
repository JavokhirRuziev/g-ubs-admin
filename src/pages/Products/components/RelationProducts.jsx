import React, {useState} from 'react';

import {useParams} from "react-router";
import {useTranslation} from "react-i18next";
import {ReactComponent as PlusIcon} from "assets/images/icons/plus.svg";

import {Button, Modal, notification, Spin} from "antd";
import Actions from "modules/entity/actions";
import Create from "./CreateRP";
import Update from "./UpdateRP";
import {useDispatch} from "react-redux";
import {Table} from "components";
import EntityContainer from "modules/entity/containers";

const RelationProducts = () => {
    const {t} = useTranslation();
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
            entity: "relationProduct",
            name: `all-${id}`,
            id: productId,
            url: `/products/${productId}`,
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
        <div>
            <Modal
                visible={createModal}
                onOk={() => showCreateModal(true)}
                onCancel={() => showCreateModal(false)}
                footer={null}
                centered
                width={600}
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
                width={600}
                destroyOnClose
            >
                <Update {...{selected, showUpdateModal, parent_id: id}}/>
            </Modal>

            <div className="d-flex align-items-center justify-content-between mb-20">
                <div className="ant-label">{t("Дополнительные продукты")}</div>
                <Button
                    type="primary"
                    size="large"
                    className="fs-14 fw-300 btn-with-icon"
                    htmlType="button"
                    onClick={() => showCreateModal(true)}
                ><PlusIcon className={"mr-0"}/></Button>
            </div>

            <EntityContainer.All
                entity="relationProduct"
                name={`all-${id}`}
                url="/products"
                params={{
                    filter: {parent_id: id},
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
                                    rowKey="id"
                                    onDelete={value => onDeleteHandler(value.id)}
                                    onRow={(record, rowIndex) => {
                                        return {
                                            onClick: () => openEditModal(record), // click row
                                        };
                                    }}
                                    columns={[
                                        // {
                                        //     title: t("ID"),
                                        //     dataIndex: "id",
                                        //     className: 'w-50',
                                        //     render: value => <div className="divider-wrapper">{value ? value : '-'}</div>
                                        // },
                                        {
                                            title: t("Артикул"),
                                            dataIndex: `code`,
                                            render: value => <div className="divider-wrapper">{value ? value : '-'}</div>
                                        },
                                        {
                                            title: t("Тен №"),
                                            dataIndex: `ten`,
                                            render: value => <div className="divider-wrapper">{value ? value : '-'}</div>
                                        },
                                        {
                                            title: t("Упаковка шт."),
                                            dataIndex: `amount`,
                                            render: value => <div className="divider-wrapper">{value ? value : '-'}</div>
                                        },
                                        {
                                            title: t("Штук в коробке"),
                                            dataIndex: `amount_box`,
                                            render: value => <div className="divider-wrapper">{value ? value : '-'}</div>
                                        },
                                        {
                                            title: t("Цена"),
                                            dataIndex: `price`,
                                            render: value => <div className="divider-wrapper">{value ? value : '-'}</div>
                                        },
                                        {
                                            title: t("Цена коробки"),
                                            dataIndex: `price_box`,
                                            render: value => <div className="divider-wrapper">{value ? value : '-'}</div>
                                        },
                                        {
                                            title: t("Размер"),
                                            dataIndex: `size`,
                                            render: value => <div className="divider-wrapper">{value ? value : '-'}</div>
                                        },
                                        {
                                            title: t("Толщина мм."),
                                            dataIndex: `thickness`,
                                            render: value => <div className="divider-wrapper">{value ? value : '-'}</div>
                                        },
                                        {
                                            title: t("Ширина"),
                                            dataIndex: `width`,
                                            render: value => <div className="divider-wrapper">{value ? value : '-'}</div>
                                        },
                                        {
                                            title: t("Длина"),
                                            dataIndex: `length`,
                                            render: value => <div className="divider-wrapper">{value ? value : '-'}</div>
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

export default RelationProducts;
