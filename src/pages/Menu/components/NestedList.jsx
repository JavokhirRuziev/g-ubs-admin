import React, { useState } from "react";

import { Dropdown, Icon, Menu, Modal, notification } from "antd";
import EntitiesActions from "store/actions/entities";
import EntityActions from "modules/entity/actions";

import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import Nestable from "react-nestable";
import get from "lodash/get";
import sortBy from "lodash/sortBy";
import cx from 'classnames';
import { useTranslation } from 'react-i18next'

import { ReactComponent as DotsIcon } from "assets/images/base/dots.svg";

const getPathById = ({
	childId,
	parentId,
	items = [],
	keys = { id: "menu_item_id", parent: "menu_item_parent_id", children: "childs" }
}) => {
	let path = {
		[keys.parent]: parentId,
		[keys.children]: []
	};
	items.forEach((item, index, array) => {
		if (array.filter(i => i[keys.id] === childId).length > 0) {
			path = {
				...path,
				[keys.children]: items.reduce((prev, curr) => [...prev, curr[keys.id]], [])
			};
		} else if (!!get(item, keys.children)) {
			const childrenPath = getPathById({
				childId,
				parentId: item[keys.id],
				items: get(item, keys.children),
				keys
			});
			if (childrenPath[keys.children].length) {
				path = {
					[keys.parent]: childrenPath[keys.parent],
					[keys.children]: childrenPath[keys.children]
				};
			}
		}
	});
	return path;
};

function NestedList({ entity, name, onCreate, onUpdate, maxDepth, menu, items, setLoading }) {
	const dispatch = useDispatch();
	const [visibleIds, setVisibleIds] = useState([]);
	const entities = useSelector(state => state.entities[entity]);
	const { t } = useTranslation();

	const toggleChildren = id => {
		const _visibleIds = visibleIds.includes(id) ? visibleIds.filter(i => i !== id) : [visibleIds, id];

		setVisibleIds(_visibleIds);
	};

	let sortedItems = [];

	sortedItems = sortBy(items, "sort");

	const deleteHandler = selectedItem => {
		Modal.confirm({
			title: t("Вы действительно хотите удалить это направление?"),
			okText: "да",
			okType: "danger",
			cancelText: "нет",
			onOk() {
				setLoading(true);
				dispatch(
					EntityActions.Form.request({
						id: get(selectedItem, "menu_item_id"),
						name,
						entity: "menuItem",
						method: 'delete',
						primaryKey: "menu_item_id",
						url: `/menu-item/${get(selectedItem, "menu_item_id")}`,
						cb: {
							success: () => {
								const parentEntity = entities[get(selectedItem, "menu_item_parent_id")];
								if(parentEntity){
									dispatch(
										EntitiesActions.Update.success({
											entity: "menuItem",
											entityId: get(selectedItem, "menu_item_parent_id"),
											data: {
												...parentEntity,
												menuItems: [
													...get(parentEntity, "menuItems", []).filter(i => i.menu_item_id !== selectedItem.menu_item_id),
												]
											}
										})
									);
								}else{
									dispatch(
										EntitiesActions.Update.success({
											entity: "menu",
											entityId: get(selectedItem, "menu_id"),
											data: {
												...menu,
												menuItems: [
													...get(menu, "menuItems", []).filter(i => i.menu_item_id !== selectedItem.menu_item_id),
												]
											}
										})
									);
								}
								notification["success"]({
									message: t("Успешно удален"),
									duration: 2
								});
							},
							error: () => {
								notification["error"]({
									message: t("Чтобы удалить это направление, нужно очистить его от соединений"),
									duration: 4
								});
							},
							finally: () => {
								setLoading(false)
							}
						}
					})
				);
			},
			onCancel() {}
		});
	};

	const onChangeHandle = ({items, parentId, childs, parent}) => {
		dispatch(
			EntityActions.Form.request({
				entity,
				name,
				method: 'put',
				url: `/menu-item/${parentId}/sort`,
				values: {childs },
				cb: {
					success: () => {},
					error: () => {
						notification["error"]({
							message: t("Что-то пошло не так"),
							duration: 2
						});
					},
					finally: () => {}
				}
			})
		);
		dispatch(
			EntitiesActions.Update.success({
				entity: 'menuItem',
				entityId: Number(parent.menu_item_id),
				data: {
					...parent,
					menuItems: items
				}
			})
		);
	};

	return (
		<>
			{sortedItems.map((listItem, key) => {
				const listItems = get(listItem, 'menuItems', []);
				const itemsWithId = listItems.reduce((prev, curr) => [...prev, {...curr, id: curr.menu_item_id}], []);
				const classNames = cx(
					"mx-col-item",
					"mx-subdivision-container",
					visibleIds.includes(listItem.menu_item_id) ? "" : "mx-subdivision__hidden"
				);
				return (
					<div {...{ key }} className={classNames}>
						<div className="mx-subdivision-title mb-15 show-action-widget">
							<div className="mx-title colored">
								<div className="mx-subdivision__toggler" onClick={() => toggleChildren(listItem.menu_item_id)} />
								{get(listItem, "title")}
							</div>
							<Dropdown
								trigger={["click"]}
								overlay={
									<Menu style={{ marginTop: 10 }}>
										<Menu.Item onClick={() => onUpdate(listItem)}>
											<Icon type="edit" />
											<span>{t('Редактировать')}</span>
										</Menu.Item>
										<Menu.Item onClick={() => deleteHandler(listItem)}>
											<Icon type="delete" />
											<span>{t('Удалить')}</span>
										</Menu.Item>
									</Menu>
								}>
								<div className="mx-action-icon"/>
							</Dropdown>
						</div>
						<div className="mx-subdivision__content">
							<div className="mx-subdivision__content--inner">
								<div className="d-flex justify-content-start mb-15">
									<div className="mx-add-sub-wrapper" onClick={() => onCreate(listItem)}>
										+ {t('Создать подменю')}
									</div>
								</div>
								<div>
									<div className="mx-subdivision--item-container ml-20">
										<Nestable
											{...{
												maxDepth
											}}
											items={itemsWithId}
											childrenProp="menuItems"
											collapsed
											renderItem={({ item, collapseIcon }) => (
												<div className={`mx-subdivision--item ${item.top_sub_menu ? 'top' : ''} ${item.secondary_sub_menu ? 'secondary' : ''}`}>
													<div className="mx-title">
														{collapseIcon} {get(item, "title")}
													</div>
													{item.top_sub_menu === 1 && (
														<div className="badge top"/>
													)}
													{item.secondary_sub_menu === 1 && (
														<div className="badge secondary"/>
													)}
													<Dropdown
														trigger={["click"]}
														overlay={
															<Menu style={{ marginTop: 10 }}>
																<Menu.Item onClick={() => onUpdate(item)}>
																	<Icon type="edit" />
																	<span>{t('Редактировать')}</span>
																</Menu.Item>
																<Menu.Item onClick={() => deleteHandler(item)}>
																	<Icon type="delete" />
																	<span>{t('Удалить')}</span>
																</Menu.Item>
															</Menu>
														}>
														<Icon component={DotsIcon} />
													</Dropdown>
												</div>
											)}
											onChange={(items, item) => {
												const pathById = getPathById({
													childId: item.menu_item_id,
													parentId: listItem.menu_item_id,
													items,
													keys: {
														id: "menu_item_id",
														parent: "menu_item_parent_id",
														children: "menuItems"
													}
												});
												onChangeHandle({
													items,
													parent: listItem,
													parentId: pathById["menu_item_parent_id"],
													childs: pathById["menuItems"]
												})
											}}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</>
	);
}

export default withRouter(NestedList)
