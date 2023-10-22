import React from "react";
import { Spin } from "antd";
import EntityForm from "modules/entity/forms";
import Form from "./FormUpdate";

const Update = ({ tabLang, showUpdateModal }) => {
	return (
		<EntityForm.Main
			method="post"
			entity="recalculation-finished-dishes"
			name={`all-${tabLang}`}
			url="/recalculation-finished-dishes"
			appendData
			primaryKey="id"
			normalizeData={data => data}
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
					name: "dishes"
				}
			]}>
			{({ isSubmitting, values, setFieldValue }) => {
				return (
					<Spin spinning={isSubmitting}>
						<Form
							{...{
								values,
								setFieldValue,
								tabLang,
								isUpdate: true
							}}
						/>
					</Spin>
				);
			}}
		</EntityForm.Main>
	);
};

export default Update;
