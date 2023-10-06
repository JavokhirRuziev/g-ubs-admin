import React from "react";

import { Spin } from "antd";
import EntityForm from "modules/entity/forms";
import Form from "./FinishedProdForm";
import { get } from "lodash";

const FinishedProdCreate = ({
	setCanUpdate,
	showCreateModal,
	parent_id,
	lang,
	selected
}) => {
	return (
		<EntityForm.Default
			method="post"
			url={`/${parent_id}/finished-dish-relations`}
			params={{
				extra: { _l: lang }
			}}
			onSuccess={(data, resetForm) => {
				resetForm();
				showCreateModal(false);
				setCanUpdate(prev => !prev);
			}}
			onError={data => {}}
			fields={[
				{
					name: "finished_dish_id",
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
		</EntityForm.Default>
	);
};

export default FinishedProdCreate;
