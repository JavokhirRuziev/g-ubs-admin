import React from "react";

import { Spin } from "antd";
import EntityForm from "modules/entity/forms";
import Form from "./Form";
import get from "lodash/get";

const Update = ({ tabLang, selected, showUpdateModal }) => {
	return (
		<EntityForm.Main
			method="put"
			entity="stocks"
			name={`all-${tabLang}`}
			url={`/stocks/${get(selected, "id")}`}
			primaryKey="id"
			normalizeData={data => data}
			id={get(selected, "id")}
			onSuccess={(data, resetForm) => {
				resetForm();
				showUpdateModal(false);
				window.location.reload();
			}}
			params={{
				include: "translate",
				extra: { _l: tabLang }
			}}
			fields={[
				{
					name: "name",
					required: true,
					value: get(selected, "translate.name")
				},
				{
					name: "description",
					required: true,
					value: get(selected, "translate.description")
				}
			]}
			updateData>
			{({ isSubmitting, values, setFieldValue }) => {
				return (
					<Spin spinning={isSubmitting}>
						<Form {...{ values, setFieldValue, isUpdate: true }} />
					</Spin>
				);
			}}
		</EntityForm.Main>
	);
};

export default Update;
