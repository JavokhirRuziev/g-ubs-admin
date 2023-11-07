import React from "react";
import { Spin } from "antd";
import EntityForm from "modules/entity/forms";
import Form from "./Form";

const Update = ({ tabLang, showUpdateModal }) => {
	return (
		<EntityForm.Main
			method="post"
			entity="clients"
			name={`all-${tabLang}`}
			url="/clients"
			appendData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				showUpdateModal(false);
				window.location.reload();
			}}
			params={{
				extra: { _l: tabLang }
			}}
			fields={[{ name: "tin", required: true }, { name: "is_active" }]}>
			{({ isSubmitting, values, setFieldValue }) => {
				return (
					<Spin spinning={isSubmitting}>
						<Form {...{ values, setFieldValue }} />
					</Spin>
				);
			}}
		</EntityForm.Main>
	);
};

export default Update;
