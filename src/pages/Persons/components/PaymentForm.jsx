import React from "react";

import { Fields } from "components";
import { Field } from "formik";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import get from "lodash/get";

const PaymentForm = ({ customerId, values, setFieldValue }) => {
	const { t } = useTranslation();
	return (
		<div>
			<div className="title-md fs-16 mb-20">{t("Оплата")}</div>
			<div className="field-container">
				<div className="ant-row ant-form-item mb-0">
					<Field
						component={Fields.AntSelect}
						name="type"
						optionLabel="name"
						optionValue="value"
						placeholder={t("Выберите типь")}
						size={"large"}
						selectOptions={[
							{ name: t("Оплата наличние"), value: 1 },
							{ name: t("Оплата терминал"), value: 2 },
							{ name: t("Оплата перечисления"), value: 3 },
							{ name: t("Оплата вторая степенная"), value: 4 },
							{ name: t("Расход наличние"), value: 5 },
							{ name: t("Расход терминал"), value: 6 },
							{ name: t("Расход перечисления"), value: 7 },
							{ name: t("Расход вторая степенная"), value: 8 }
						]}
					/>
				</div>
			</div>

			<Field
				component={Fields.AsyncSelect}
				name="invoice_id"
				placeholder={t("Виберите счет-фактура")}
				isClearable
				isSearchable
				loadOptionsUrl="/crm/account-balance"
				loadOptionsParams={search => {
					return {
						filter: {
							customer_id: customerId,
							is_income: 0
						},
						include: "invoices.contracts.balance",
						extra: { order: search }
					};
				}}
				className="mb-20"
				optionLabel={value => `${t("Заказ")} №${get(value, "invoices.contracts.order_id")} - ${value.sum} (${get(value, "invoices.contracts.balance")})`}
				optionValue="invoices_id"
			/>

			<Field
				component={Fields.AntInput}
				name="sum"
				type="text"
				autoComplete={"off"}
				placeholder={t("Сумма")}
				size="large"
				onChange={event => {
					setFieldValue("sum", event.target.value.replace(/\$\s?|(,*)/g, ""));
				}}
				value={values.sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
			/>
			<Field
				component={Fields.AntTextarea}
				name="comment"
				type="text"
				placeholder={t("Комментария")}
				rows={3}
				size="large"
			/>
			<Button
				type="primary"
				size="large"
				className="fs-14 fw-300"
				htmlType="submit"
			>{t("Сохранить")}</Button>
		</div>
	);
};

export default PaymentForm;
