import React from "react";
import { Spin } from "antd";
import EntityForm from "modules/entity/forms";
import Form from "./Form";

const Create = ({ tabLang, showCreateModal }) => {
	return (
		<EntityForm.Main
			method="post"
			entity="stocks"
			name={`all-${tabLang}`}
			url="/stocks"
			appendData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				showCreateModal(false);
				window.location.reload();
			}}
			params={{
				include: "translate",
				extra: { _l: tabLang }
			}}
			fields={[
				{ name: "name", required: true },
				{ name: "description", required: true }
			]}>
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

export default Create;
