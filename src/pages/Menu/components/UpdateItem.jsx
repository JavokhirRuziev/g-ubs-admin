import React from "react";

import { Spin, Modal } from "antd";
import EntityForm from 'modules/entity/forms';
import Form from "./FormItem";

import get from "lodash/get";

const UpdateItem = ({ item, visible, menuId, onCancel, lang }) => {

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
					entity="menuItems"
					name={`menuItems-${menuId}`}
					url={`/menu-item/${item.id}`}
					normalizeData={data => data}
					primaryKey="id"
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
						}
					]}
					appendData={true}
					params={{extra:{_l:lang}}}
					onSuccess={() => {
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
