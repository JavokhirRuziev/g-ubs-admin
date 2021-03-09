import React  from "react";

import { Modal, Spin } from "antd";
import EntityForm from 'modules/entity/forms';
import Form from "./FormItem";
import { withRouter } from "react-router";

const Create = ({ visible, menuId, onCancel, lang }) => {

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
					entity="menuItems"
					name={`menuItems-${menuId}`}
					url="/menu-item"
					primaryKey="id"
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
							name: "menu_id",
							value: menuId
						}
					]}
					prependData={true}
					params={{
						extra:{_l:lang}
					}}
					onSuccess={() => {
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
