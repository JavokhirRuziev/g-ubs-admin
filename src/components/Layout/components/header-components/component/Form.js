import React from "react";
import { Fields } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import payments from "./paymentMethods";
import { Button } from "antd";

export default function Form() {
	const { t } = useTranslation("main");
	return (
		<>
			<div className="payment-method">
				<Field
					component={Fields.AntSelect}
					name="payment_type"
					label={t("Тип оплаты")}
					size={"large"}
					allowClear
					selectOptions={payments}
				/>
			</div>
			<Field
				component={Fields.AntInput}
				name="amount"
				type="number"
				placeholder={t("Сумма")}
				label={t("Сумма")}
				size="large"
			/>
			<Field
				component={Fields.AntInput}
				name="''"
				type="text"
				placeholder={t("Комментария")}
				label={t("Комментария")}
				size="large"
			/>
			<div style={{ textAlign: "right" }}>
				<Button
					type="primary"
					size="large"
					className="fs-14 fw-300"
					htmlType="submit">
					{t("Подтвердить")}
				</Button>
			</div>
		</>
	);
}
