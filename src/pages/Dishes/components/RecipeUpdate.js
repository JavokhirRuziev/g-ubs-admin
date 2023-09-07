import React, { useEffect } from "react";

import { Spin } from "antd";
import EntityForm from "modules/entity/forms";
import Form from "./RecipeForm";
import get from "lodash/get";
import axios from "axios";
import config from "config";

const RecipeUpdate = ({ setCanUpdate,selected, showUpdateModal, parent_id, lang }) => {

	return (
		<EntityForm.Default
			method="put"
			url={`/${parent_id}/dish-products/${get(selected, "id")}`}
			params={{
				extra: { _l: lang }
			}}
			onSuccess={(data, resetForm) => {
				resetForm();
				showUpdateModal(false);
				setCanUpdate(prev => !prev)
			}}
			fields={[
				{
					name: "product_id",
					onSubmitValue: value => value.id,
					value: get(selected, "product"),
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
		</EntityForm.Default>
	);
};

export default RecipeUpdate;
