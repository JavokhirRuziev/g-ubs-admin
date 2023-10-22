import React from "react";
import { Spin } from "antd";
import EntityForm from "modules/entity/forms";
import Form from "./Form";

const Create = ({ tabLang, showCreateModal }) => {
	return (
		<EntityForm.Main
			method="post"
			entity="products"
			name={`all-${tabLang}`}
			url="/products"
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
					onSubmitValue: value => value.id
				},
				{
					name: "product_category_id",
					required: true
				},
				{
					name: "unit_id",
					required: true,
					onSubmitValue: value => value.id
				},
				{ name: "order", required: true },
				{ name: "is_active" },
				{ name: "deficit_threshold", required: true },
				{ name: "average_quantity", required: true }
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
