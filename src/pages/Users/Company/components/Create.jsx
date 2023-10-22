import React, { useState } from "react";
import { Spin } from "antd";
import EntityForm from "modules/entity/forms";
import Form from "./Form";

const Create = ({ showCreateModal }) => {
	const [send_roles, setSend_roles] = useState();
	return (
		<EntityForm.Main
			method="post"
			entity="user"
			name="companies"
			url="/user"
			appendData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				showCreateModal(false);
			}}
			fields={[
				{ name: "role", required: true, value: "company" },
				{ name: "name", required: true },
				{ name: "login", required: true },
				{ name: "password", required: true },
				{ name: "companyName", required: true },
				{
					name: "roles",
					onSubmitValue: () => send_roles
				}
			]}
			params={{
				include: "company"
			}}>
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
