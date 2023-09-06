import React from "react";
import { Spin } from "antd";
import EntityForm from "modules/entity/forms";
import Form from "./Form";
import get from "lodash/get";

const Create = ({ tabLang, showCreateModal }) => {
	return (
		<EntityForm.Main
			method="post"
			entity="product-categories"
			name={`all-${tabLang}`}
			url="/product-categories"
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
				{ name: "description", required: true },
				{
					name: "stock_id",
					required: true,
					onSubmitValue: value => value.translate.stock_id
				},
				{ name: "order", required: true },
				{ name: "is_active", required: true }
			]}>
			{({ isSubmitting, values, setFieldValue }) => {
				return (
					<Spin spinning={isSubmitting}>
						<Form {...{ values, setFieldValue, tabLang }} />
					</Spin>
				);
			}}
		</EntityForm.Main>
	);
};

export default Create;
