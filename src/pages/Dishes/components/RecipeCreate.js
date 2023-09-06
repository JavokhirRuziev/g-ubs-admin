import React from "react";

import { Spin } from "antd";
import EntityForm from "modules/entity/forms";
import Form from "./RecipeForm";

const RecipeCreate = ({ showCreateModal, parent_id, lang, selected }) => {
	return (
		<EntityForm.Main
			method="post"
			entity="dish-products"
			name={`all-${parent_id}`}
			url={`/${parent_id}/dish-products`}
			appendData
			primaryKey="id"
			normalizeData={data => data}
			params={{
				extra: { _l: lang }
			}}
			onSuccess={(data, resetForm) => {
				resetForm();
				showCreateModal(false);
				console.log(data);
				window.location.reload();
			}}
			onError={data => {
				console.log(data);
				window.location.reload();
			}}
			fields={[
				{
					name: "product_id",
					onSubmitValue: value => value && value.id,
					required: true
				},
				{
					name: "count",
					required: true
				}
			]}>
			{({ isSubmitting, values, setFieldValue, submitForm }) => {
				return (
					<Spin spinning={isSubmitting}>
						<Form
							{...{
								values,
								setFieldValue,
								submitForm,
								lang,
								selected
							}}
						/>
					</Spin>
				);
			}}
		</EntityForm.Main>
	);
};

export default RecipeCreate;
