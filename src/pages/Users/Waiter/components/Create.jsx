import React, { useState } from "react";

import { Spin } from "antd";
import EntityForm from "modules/entity/forms";
import Form from "./Form";

const Create = ({ showCreateModal }) => {
	const [send_roles, setSend_roles] = useState([
		{ role: "dishes", permissions: ["read"] },
		{ role: "menus", permissions: ["read"] },
		{ role: "places", permissions: ["read"] },
		{ role: "tables", permissions: ["read"] }
	]);

	return (
		<EntityForm.Main
			method="post"
			entity="user"
			name="waiter"
			url="/user"
			appendData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				showCreateModal(false);
				console.log(data);
			}}
			fields={[
				{ name: "role", required: true, value: "waiter" },
				{ name: "name", required: true },
				{ name: "login", required: true },
				{ name: "password", required: true },
				{ name: "company_id", value: null },
				{
					name: "payment_type"
				},
				{
					name: "percent"
				},
				{
					name: "guarantee"
				},
				{
					name: "roles",
					onSubmitValue: () => send_roles,
					value: send_roles
				},
				{
					name: "status",
					value: true,
					onSubmitValue: value => (value ? 1 : 0)
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
