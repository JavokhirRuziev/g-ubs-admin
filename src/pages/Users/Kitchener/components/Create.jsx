import React, { useState } from "react";

import { Spin } from "antd";
import EntityForm from "modules/entity/forms";
import Form from "./Form";

const Create = ({ showCreateModal }) => {
	const [send_roles, setSend_roles] = useState([
		{ role: "dishes", permissions: ["read", "create", "update", "delete"] },
		{ role: "stocks", permissions: ["read"] },
		{ role: "product_categories", permissions: ["read"] },
		{ role: "products", permissions: ["read"] },
		{ role: "brought_products", permissions: ["read"] },
		{
			role: "distributed_products",
			permissions: ["read", "create", "update", "delete"]
		}
	]);
	return (
		<EntityForm.Main
			method="post"
			entity="user"
			name="kitchener"
			url="/user"
			appendData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				showCreateModal(false);
			}}
			fields={[
				{ name: "role", required: true, value: "kitchener" },
				{ name: "name", required: true },
				{ name: "login", required: true },
				{ name: "password", required: true },
				{ name: "company_id", value: null },
				{
					name: "status",
					value: true,
					onSubmitValue: value => (value ? 1 : 0)
				},
				{
					name: "roles",
					onSubmitValue: () => send_roles
				}
			]}>
			{({ isSubmitting, values, setFieldValue }) => {
				return (
					<Spin spinning={isSubmitting}>
						<Form
							{...{
								values,
								setFieldValue,
								send_roles,
								setSend_roles
							}}
						/>
					</Spin>
				);
			}}
		</EntityForm.Main>
	);
};

export default Create;
