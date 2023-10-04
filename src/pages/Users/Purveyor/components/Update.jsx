import React, { useState } from "react";

import { Spin } from "antd";
import EntityForm from "modules/entity/forms";
import Form from "./Form";
import get from "lodash/get";

const Update = ({ selected, showUpdateModal }) => {
	const [send_roles, setSend_roles] = useState();
	return (
		<EntityForm.Main
			method="put"
			entity="user"
			name={`provider`}
			url={`/user/${get(selected, "id")}`}
			primaryKey="id"
			normalizeData={data => data}
			id={get(selected, "id")}
			onSuccess={(data, resetForm) => {
				resetForm();
				showUpdateModal(false);
			}}
			fields={[
				{
					name: "role",
					required: true,
					value: "provider"
				},
				{
					name: "name",
					required: true,
					value: get(selected, "name")
				},
				{
					name: "login",
					required: true,
					value: get(selected, "login")
				},
				{
					name: "password"
				},
				{
					name: "company_id",
					value: null
				},
				{
					name: "status",
					value: get(selected, "status") === 1,
					onSubmitValue: value => (value ? 1 : 0)
				},
				{
					name: "roles",
					value: get(selected, "roles"),
					onSubmitValue: () => send_roles
				}
			]}
			updateData>
			{({ isSubmitting, values, setFieldValue }) => {
				return (
					<Spin spinning={isSubmitting}>
						<Form
							{...{
								values,
								setFieldValue,
								isUpdate: true,
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

export default Update;
