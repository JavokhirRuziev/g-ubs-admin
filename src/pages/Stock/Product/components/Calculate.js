import React from "react";
import { Spin } from "antd";
import EntityForm from "modules/entity/forms";
import Form from "./FormCalculate";

const Calculate = ({ tabLang, showRecalculation, selected }) => {
	return (
		<EntityForm.Main
			method="post"
			entity="recalculation-products"
			name={`all-${tabLang}`}
			url="/recalculation-products"
			appendData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				showRecalculation(false);
				window.location.reload();
			}}
			params={{
				include: "translate",
				extra: { _l: tabLang }
			}}
			fields={[
				{
					name: "product_id",
					value: selected.translate.product_id
				},
				{ name: "count", required: true, value: Number(selected.count) }
			]}>
			{({ isSubmitting, values, setFieldValue }) => {
				return (
					<Spin spinning={isSubmitting}>
						<Form
							{...{ values, setFieldValue, tabLang, selected }}
						/>
					</Spin>
				);
			}}
		</EntityForm.Main>
	);
};

export default Calculate;
