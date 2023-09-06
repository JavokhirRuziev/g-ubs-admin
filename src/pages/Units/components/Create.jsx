import React from "react";
import { Spin } from "antd";
import EntityForm from "modules/entity/forms";
import Form from "./Form";

const Create = ({ showCreateModal }) => {
	return (
		<EntityForm.Main
			method="post"
			entity="unit"
			name={`all`}
			url="/units"
			appendData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				showCreateModal(false);
			}}
			fields={[
				{ name: "title_ru", required: true },
				{ name: "title_uz" },
				{ name: "title_en" }
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
