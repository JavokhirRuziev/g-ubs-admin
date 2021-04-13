import React, {useState} from 'react';

import {Board, Meta} from "components";
import {Button, Spin, Modal, notification, Dropdown, Menu, Icon, Tag} from "antd";
import EntityContainer from 'modules/entity/containers';
import Create from "./components/Create";
import Update from "./components/Update";
import ModulesActions from "modules/entity/actions";
import Actions from "store/actions";

import {useTranslation} from "react-i18next";
import {useSelector, useDispatch} from "react-redux";
import {CopyToClipboard} from "components/SmallComponents";
import Nestable from "react-nestable";
import get from "lodash/get";
import {ReactComponent as DotsIcon} from "assets/images/base/dots.svg";

const List = () => {
    const langCode = useSelector(state => state.system.currentLangCode);

    const [createModal, showCreateModal] = useState(false);
    const [updateModal, showUpdateModal] = useState(false);
    const [selected, setSelected] = useState(null);
    const [metaModal, showMetaModal] = useState(false);

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
            name: `categoryProduct`,
            id: id,
            url: `/categories/${id}`,
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

    const updateMenuItems = (items) => {
        const ids = items.reduce((prev, curr) => [...prev, curr.id], []);
        dispatch(ModulesActions.FormDefault.request({
            method: 'put',
            url: `/categories/sort`,
            values: {
                nestable: items
            },
            cb: {
                success: () => {
                    notification["success"]({
                        message: t("Успешно изменено"),
                        duration: 2
                    });
                    dispatch(Actions.entity.LoadAll.success({
                        ids: ids,
                        entity: 'category',
                        name: 'categoryProduct',
                        params: {page: 1},
                        meta: {
                            currentPage: 1,
                            pageCount: 1,
                            perPage: 50,
                            totalCount: items.length
                        },
                    }))
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
    }

    return (
        <>
            <Modal
                visible={metaModal}
                onOk={() => showMetaModal(true)}
                onCancel={() => showMetaModal(false)}
                footer={null}
                centered
                width={430}
                destroyOnClose
            >
                <Meta.MetaCategory {...{showMetaModal, selected}}/>
            </Modal>
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
                <div className="title-md">{t("Категория продуктов")}</div>
                <Button
                    type="primary"
                    size="large"
                    className="fs-14 fw-300 ml-10"
                    htmlType="button"
                    onClick={() => showCreateModal(true)}
                >Добавить</Button>
            </div>

            <Board className="border-none">
                <EntityContainer.All
                    entity="category"
                    name="categoryProduct"
                    url="/categories"
                    params={{
                        sort: 'sort',
                        limit: 50,
                        include: "file,meta",
                        filter: {type: 1}
                    }}
                >
                    {({items, isFetched, meta}) => {
                        return (
                            <Spin spinning={!isFetched}>
                                <div className="pad-20">
                                    <Nestable
                                        maxDepth={1}
                                        items={items}
                                        childrenProp={"children"}
                                        collapsed={false}
                                        renderItem={({item, collapseIcon}) => (
                                            <div className={`mx-subdivision--item`}>
                                                <div className="d-flex align-items-center" style={{width: '100%'}}>
                                                    <div className="mx-title" style={{width: '40%'}}>
                                                        {collapseIcon} {get(item, `name_${langCode}`)}
                                                    </div>
                                                    <div className="pl-30" style={{width: '40%'}}>
                                                        <CopyToClipboard str={`/category/${get(item, 'slug')}`}/>
                                                    </div>
                                                    <Tag color={item.meta ? 'green' : 'blue'} className="cursor-pointer" onClick={() => {
                                                        setSelected(item);
                                                        showMetaModal(true);
                                                    }}>
                                                        <b>SEO</b>
                                                    </Tag>
                                                </div>
                                                <Dropdown
                                                    trigger={["click"]}
                                                    overlay={
                                                        <Menu style={{marginTop: 10}}>
                                                            <Menu.Item onClick={() => {
                                                                openEditModal(item)
                                                            }}>
                                                                <Icon type="edit"/>
                                                                <span>{t('Редактировать')}</span>
                                                            </Menu.Item>
                                                            <Menu.Item onClick={() => onDeleteHandler(item.id)}>
                                                                <Icon type="delete" />
                                                                <span>{t('Удалить')}</span>
                                                            </Menu.Item>
                                                        </Menu>
                                                    }>
                                                    <Icon component={DotsIcon}/>
                                                </Dropdown>
                                            </div>
                                        )}
                                        onChange={(items) => {
                                            updateMenuItems(items)
                                        }}
                                    />
                                </div>
                            </Spin>
                        );
                    }}
                </EntityContainer.All>
            </Board>
        </>
    );
};

export default List;