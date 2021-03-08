import React from "react";

import { Spin, Modal } from "antd";
import EntitiesActions from "store/actions/entities";
import EntityForm from 'modules/entity/forms';
import Form from "./FormItem";

import get from "lodash/get";
import { useSelector, useDispatch } from "react-redux";

const UpdateItem = ({ item, onCancel, visible, name, lang }) => {
	const dispatch = useDispatch();
	const entities = useSelector(state => get(state, ["entities", "menuItem"], {}));

	return (
		<Modal
			visible={visible}
			onOk={() => {}}
			onCancel={onCancel}
			closable={true}
			footer={null}
			destroyOnClose
		>
			<div>
				<EntityForm.Main
					method="put"
					id={get(item, "menu_item_id")}
					entity="menuItem"
					name={name}
					url={`/menu-item/${get(item, "menu_item_id")}`}
					normalizeData={data => data}
					primaryKey="menu_item_id"
					fields={[
						{
							name: "title",
							required: true,
							value: get(item, "title")
						},
						{
							name: "url",
							required: true,
							value: get(item, "url")
						},
						{
							name: "sort",
							required: false,
							value: get(item, "sort")
						}
					]}
					params={{extra:{_l:lang}}}
					onSuccess={data => {
						const parentEntity = entities[get(item, "menu_item_parent_id")];
						if(parentEntity){
							dispatch(
								EntitiesActions.Update.success({
									entity: "menuItem",
									entityId: get(item, "menu_item_parent_id"),
									data: {
										...parentEntity,
										menuItems: [
											...get(parentEntity, "menuItems", []).filter(i => i.menu_item_id !== data.menu_item_id),
											data
										]
									}
								})
							);
						}
						onCancel();
					}}>
					{({ isSubmitting, values, setFieldValue }) => {
						return (
							<Spin spinning={isSubmitting}>
								<Form {...{values, setFieldValue, isUpdate:true}}/>
							</Spin>
						);
					}}
				</EntityForm.Main>
			</div>
		</Modal>
	);
};

export default UpdateItem;
