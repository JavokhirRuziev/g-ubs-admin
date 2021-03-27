import React, {useState} from "react";

import {Button, Dropdown, Icon, Menu, Modal, notification, Spin} from "antd";
import {Board} from "components";
import {NavigationHelper} from 'components/SmallComponents';
import EntityContainer from "modules/entity/containers";
import EntityActions from "modules/entity/actions";

import CreateModal from "./components/CreateItem";
import UpdateModal from "./components/UpdateItem";

import get from "lodash/get";
import {useTranslation} from "react-i18next";
import qs from "query-string";
import {ReactComponent as DotsIcon} from "../../assets/images/base/dots.svg";
import Nestable from "react-nestable";
import {useDispatch} from "react-redux";

const View = ({location, match}) => {

    const [selected, setSelected] = useState({});
    const [modalVisible, setModalVisible] = useState({});
    const dispatch = useDispatch();

    const {id} = match.params;
    const query = qs.parse(location.search);
    const {alias} = query;
    const [canUpdate, setCanUpdate] = useState(false);
    const {t} = useTranslation();

    const openModal = name => {
        setModalVisible({
            ...modalVisible,
            [name]: true
        });
    };

    const closeModal = name => {
        setModalVisible({
            ...modalVisible,
            [name]: false
        });
    };

    const updateMenuItems = (items) => {

        dispatch(EntityActions.FormDefault.request({
            method: 'put',
            url: `/menu-item/sort`,
            values: {
                nestable: items
            },
            cb: {
                success: () => {
                    notification["success"]({
                        message: t("Успешно изменено"),
                        duration: 2
                    });
                    setCanUpdate(!canUpdate)
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

    const deleteAction = menu => {
        dispatch(EntityActions.Form.request({
            method: 'delete',
            entity: "menuItems",
            name: `menuItems-${id}`,
            id: menu.id,
            url: `/menu-item/${menu.id}`,
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
                finally: () => {}
            }
        }))
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-20">
                <div className="title-md">{alias} </div>
                <Button
                    type="primary"
                    size="large"
                    className="fs-14 fw-300 ml-10"
                    htmlType="button"
                    onClick={() => openModal("create")}
                >{t("Добавить")}</Button>
            </div>

            <CreateModal
                menuId={id}
                name={alias}
                visible={!!modalVisible["create"]}
                onCancel={() => closeModal("create")}
            />
            <UpdateModal
                menuId={id}
                item={selected}
                name={alias}
                visible={!!modalVisible["update"]}
                onCancel={() => closeModal("update")}
            />


            <Board className="border-none">
                <EntityContainer.All
                    entity="menuItems"
                    name={`menuItems-${id}`}
                    url="/menu-item"
                    primaryKey={"id"}
                    canUpdate={!canUpdate}
                    params={{
                        limit: 50,
                        sort: 'sort',
                        filter: {menu_id: id}
                    }}
                >
                    {({items, isFetched, meta}) => {
                        return (
                            <Spin spinning={!isFetched}>
                                {items.length > 0 ? (
                                    <div className="pad-20">
                                        <Nestable
                                            maxDepth={2}
                                            items={items}
                                            childrenProp="menuItems"
                                            collapsed={false}
                                            renderItem={({item, collapseIcon}) => (
                                                <div className={`mx-subdivision--item`}>
                                                    <div className="mx-title">
                                                        {collapseIcon} {get(item, "title")}
                                                    </div>
                                                    <Dropdown
                                                        trigger={["click"]}
                                                        onUpdate={selected => {
                                                            setSelected(selected);
                                                            openModal("update");
                                                        }}
                                                        overlay={
                                                            <Menu style={{marginTop: 10}}>
                                                                <Menu.Item onClick={() => {
                                                                    setSelected(item);
                                                                    openModal("update");
                                                                }}>
                                                                    <Icon type="edit"/>
                                                                    <span>{t('Редактировать')}</span>
                                                                </Menu.Item>
                                                                <Menu.Item onClick={() => onDeleteHandler(item)}>
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
                                ) : (
                                    <div className="pad-20">
                                        <NavigationHelper
                                            text={t("Этого алиасе нет меню")}
                                            className="mt-15 mb-15"
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

export default View;
