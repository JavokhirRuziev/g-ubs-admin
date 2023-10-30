import React from "react";

import { Fields } from "components";
import { Field } from "formik";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { get } from "lodash";

const Form = ({ isUpdate, selected, tabLang }) => {
	const { t } = useTranslation("main");

	return (
		<div>
			<div className="title-md fs-16 mb-20">
				{isUpdate ? t("Изменить") : t("Добавить")}
			</div>

			<div className="title-md fs-16 mb-20">
				{get(selected, "translate.name")}
				{" - "}
				{get(selected, `unit[title_${tabLang}]`)}
			</div>
			<Field
				component={Fields.AntInput}
				name="count"
				type="number"
				placeholder={t("Введите описания")}
				label={t("Описания")}
				size="large"
			/>

			<Button
				type="primary"
				size="large"
				className="fs-14 fw-300"
				htmlType="submit">
				{isUpdate ? t("Сохранить") : t("Добавить")}
			</Button>
		</div>
	);
};

export default Form;
