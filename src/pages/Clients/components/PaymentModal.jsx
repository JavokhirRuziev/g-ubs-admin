import React from "react";

import { Spin } from "antd";
import EntityForm from "modules/entity/forms";
import Form from "./PaymentForm";

const PaymentModal = ({ showPaymentModal, selected }) => {
	return (
		<EntityForm.Main
			method="post"
			entity="customer"
			name="customers"
			url={`/crm/account-balance/expense/${selected.id}`}
			appendData
			primaryKey="id"
			params={{ include: "customer.balance,customer.customerCategories" }}
			normalizeData={data => data.customer}
			onSuccess={(data, resetForm) => {
				resetForm();
				showPaymentModal();
			}}
			fields={[
				{
					name: "invoice_id",
					onSubmitValue: value => value ? value.invoices_id : null
				},
				{
					name: "sum",
					required: true,
					onSubmitValue: value => value && Number(value)
				},
				{
					name: "comment"
				},
				{
					name: "type",
					value: 1,
					required: true
				}
			]}
		>
			{({ isSubmitting, values, setFieldValue, submitForm }) => {
				return (
					<Spin spinning={isSubmitting}>
						<Form {...{ values, setFieldValue, submitForm, customerId: selected.id }} />
					</Spin>
				);
			}}
		</EntityForm.Main>
	);
};

export default PaymentModal;
