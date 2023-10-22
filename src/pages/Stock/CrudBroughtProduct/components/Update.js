import React from "react";

import { Spin } from "antd";
import EntityForm from "modules/entity/forms";
import Form from "./Form";
import get from "lodash/get";

const Update = ({ tabLang, selected, showUpdateModal }) => {
	console.log(selected);
	return (
		<EntityForm.Main
			method="put"
			entity="stock-brought-products"
			name={`all-${tabLang}`}
			url={`/stock-brought-products/${get(selected, "id")}`}
			primaryKey="id"
			normalizeData={data => data}
			id={get(selected, "id")}
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
					name: "stock_id",
					required: true,
					value: get(selected, "stock"),
					onSubmitValue: value => value.id
				},
				{
					name: "product_id",
					required: true,
					value: get(selected, "product.translate.id")
				},
				{
					name: "count",
					required: true,
					value: get(selected, "count")
				},
				{
					name: "price",
					required: true,
					value: get(selected, "price")
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
								tabLang,
								selected
							}}
						/>
					</Spin>
				);
			}}
		</EntityForm.Main>
	);
};

export default Update;
