import React from "react";
import { Spin } from "antd";
import EntityForm from "modules/entity/forms";
import Form from "./Form";

const Create = ({ tabLang, showCreateModal }) => {
	return (
		<EntityForm.Main
			method="post"
			entity="stock-distributed-products"
			name={`all-${tabLang}`}
			url="/stock-distributed-products"
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
				{ name: "count", required: true },
				{
					name: "product_id",
					required: true
				},
				{
					name: "stock_id",
					required: true,
					onSubmitValue: value => value.id
				}
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
