import React from "react";

import { Spin } from "antd";
import EntityForm from "modules/entity/forms";
import Form from "./FinishedProdForm";
import get from "lodash/get";

const RecipeUpdate = ({
	setCanUpdate,
	selected,
	showUpdateModal,
	parent_id,
	lang,
	values
}) => {
	return (
		<EntityForm.Default
			method="put"
			url={`/${parent_id}/finished-dish-relations/${get(selected, "id")}`}
			params={{
				extra: { _l: lang }
			}}
			onSuccess={(data, resetForm) => {
				resetForm();
				showUpdateModal(false);
				setCanUpdate(prev => !prev);
			}}
			fields={[
				{
					name: "finished_dish_id",
					onSubmitValue: value => value.id,
					value: get(selected, "finished_dish"),
					required: true
				},
				{
					name: "count",
					value: get(selected, "count")
				}
			]}
			updateData>
			{({ isSubmitting, setFieldValue, submitForm }) => {
				return (
					<Spin spinning={isSubmitting}>
						<Form
							{...{
								values,
								setFieldValue,
								isUpdate: true,
								submitForm,
								lang,
								selected,
								id: get(selected, "id"),
								parent_id
							}}
						/>
					</Spin>
				);
			}}
		</EntityForm.Default>
	);
};

export default RecipeUpdate;
