import React from "react";

import { Spin } from "antd";
import EntityForm from "modules/entity/forms";
import Form from "./Form";
import get from "lodash/get";
import EntityContainer from "modules/entity/containers";

const Update = ({ tabLang, selected, showUpdateModal, id }) => {
	return (
		<EntityContainer.One
			entity="products"
			name={get(selected, "id")}
			url={`/products/${get(selected, "id")}`}
			primaryKey="id"
			id={get(selected, "id")}
			params={{
				include: "translate",
				extra: { _l: tabLang }
			}}>
			{({ item, isFetched }) => {
				return (
					<Spin spinning={!isFetched}>
						<EntityForm.Main
							method="put"
							entity="products"
							name={`all-${tabLang}`}
							url={`/products/${get(item, "id")}`}
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
									name: "name",
									required: true,
									value: get(item, "translate.name")
								},
								{
									name: "description",
									required: true,
									value: get(item, "translate.description")
								},
								{
									name: "stock_id",
									required: true,
									value: get(item, "stock"),
									onSubmitValue: value => value.id
								},
								{
									name: "order",
									required: true,
									value: get(item, "order")
								},

								{
									name: "product_category_id",
									required: true,
									value: get(
										item,
										"category.translate.product_category_id"
									)
								},
								{
									name: "unit_id",
									required: true,
									value: get(item, "unit"),
									onSubmitValue: value => value.id
								},
								{
									name: "deficit_threshold",
									required: true,
									value: get(item, "deficit_threshold")
								},
								{
									name: "average_quantity",
									required: true,
									value: get(item, "average_quantity")
								},
								{
									name: "is_active",
									value: get(item, "is_active") ? 1 : 0
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
												item
											}}
										/>
									</Spin>
								);
							}}
						</EntityForm.Main>
					</Spin>
				);
			}}
		</EntityContainer.One>
	);
};

export default Update;
