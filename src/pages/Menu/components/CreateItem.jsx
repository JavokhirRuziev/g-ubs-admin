import React  from "react";

import { Modal, Spin } from "antd";
import EntityForm from 'modules/entity/forms';
import EntitiesActions from "store/actions/entities";
import Form from "./FormItem";

import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

const Create = ({ visible, menu, parent, onCancel, name, lang }) => {
	const dispatch = useDispatch();
	const menuEntities = useSelector(state => get(state, ["entities", "menu"], {}));

	return (
		<Modal
			visible={visible}
			onOk={() => {}}
			onCancel={onCancel}
			closable={true}
			footer={null}
			destroyOnClose>
			<div>
				<EntityForm.Main
					method="post"
					entity="menuItem"
					name={`menuItems-${name}`}
					url="/menu-item"
					primaryKey="menu_item_id"
					normalizeData={data => data}
					fields={[
						{
							name: "title",
							required: true
						},
						{
							name: "url",
							required: true
						},
						{
							name: "sort",
							required: false
						},
						{
							name: "menu_id",
							value: isEmpty(parent) ? get(menu, "menu_id") : undefined
						},
						{
							name: "menu_item_parent_id",
							value: !isEmpty(parent) ? parent.menu_item_id : undefined
						},
						{
							name: "icon",
							value: [],
							onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
						},
						{name: "main_sub_menu", value: true, onSubmitValue: value => value ? 1 : 0},
						{name: "secondary_sub_menu", value: false, onSubmitValue: value => value ? 1 : 0},
						{name: "top_sub_menu", value: false, onSubmitValue: value => value ? 1 : 0}
					]}
					appendData
					params={{
						extra:{_l:lang}
					}}
					onSuccess={data => {
						if(isEmpty(parent)){
							const updatedMenuEntities = menuEntities[menu.menu_id];
							const newUpdatedMenuEntities = {
								...updatedMenuEntities,
								menuItems: [
									...updatedMenuEntities.menuItems,
									data.menu_item_id
								]
							};
							dispatch(
								EntitiesActions.Update.success({
									entity: "menu",
									entityId: menu.menu_id,
									data: newUpdatedMenuEntities
								})
							);
						}else{
							const newUpdatedMenuItem = {
								...parent,
								menuItems: [
									...parent.menuItems,
									data
								]
							};
							dispatch(
								EntitiesActions.Update.success({
									entity: "menuItem",
									entityId: parent.menu_item_id,
									data: newUpdatedMenuItem
								})
							);
						}
						onCancel();
					}}
				>
					{({ isSubmitting, values, setFieldValue }) => (
						<Spin spinning={isSubmitting}>
							<Form {...{values, setFieldValue}}/>
						</Spin>
					)}
				</EntityForm.Main>
			</div>
		</Modal>
	);
};

export default withRouter(Create);
