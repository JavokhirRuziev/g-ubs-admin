import React from "react";

import { Spin } from "antd";
import EntityForm from "modules/entity/forms";
import Form from "./Form";
import get from "lodash/get";

const Update = ({ tabLang, selected, showUpdateModal }) => {
	return (
		<EntityForm.Main
			method="put"
			entity="stock-distributed-products"
			name={`all-${tabLang}`}
			url={`/stock-distributed-products/${get(selected, "id")}`}
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
					name: "count",
					required: true,
					value: get(selected, "count")
				},
				{
					name: "product_id",
					required: true,
					value: get(selected, "product")
				},
				{
					name: "stock_id",
					required: true,
					value: get(selected, "stock"),
					onSubmitValue: value => value.id
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
								tabLang
							}}
						/>
					</Spin>
				);
			}}
		</EntityForm.Main>
	);
};

export default Update;
