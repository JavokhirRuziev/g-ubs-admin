import React, { useEffect } from "react";

import { Spin } from "antd";
import EntityForm from "modules/entity/forms";
import Form from "./RecipeForm";
import get from "lodash/get";
import axios from "axios";
import config from "config";

const RecipeUpdate = ({ selected, showUpdateModal, parent_id, lang }) => {
	console.log(get(selected, "product.translate.name"));
	console.log(selected);
	useEffect(() => {
		axios
			.get(`${config.API_ROOT}/${parent_id}/dish-products/`)
			.then(res => console.log(res))
			.catch(err => {
				console.log(err);
			});
	}, []);
	return (
		<EntityForm.Main
			method="put"
			entity="dish-products"
			name={`all-${parent_id}`}
			url={`/${parent_id}/dish-products/${get(selected, "id")}`}
			primaryKey="id"
			params={{
				extra: { _l: lang }
			}}
			normalizeData={data => data}
			id={get(selected, "id")}
			onSuccess={(data, resetForm) => {
				resetForm();
				showUpdateModal(false);
				window.location.reload();
			}}
			fields={[
				{
					name: "product_id",
					onSubmitValue: value => value.id,
					value: get(selected, "product.translate.name"),
					required: true
				},
				{
					name: "count",
					value: get(selected, "count")
				}
			]}
			updateData>
			{({ isSubmitting, values, setFieldValue, submitForm }) => {
				return (
					<Spin spinning={isSubmitting}>
						<Form
							{...{
								values,
								setFieldValue,
								isUpdate: true,
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

export default RecipeUpdate;
