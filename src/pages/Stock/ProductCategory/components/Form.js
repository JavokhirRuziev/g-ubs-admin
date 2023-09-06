import React from "react";

import { Fields } from "components";
import { Field } from "formik";
import { Button } from "antd";
import { useTranslation } from "react-i18next";

import get from "lodash/get";

const Form = ({ isUpdate, tabLang }) => {
	const { t } = useTranslation("main");
	const isActiveArr = [
		{ name: "Неактивный", value: 0 },
		{ name: "Активный", value: 1 }
	];

	return (
		<div>
			<div className="title-md fs-16 mb-20">
				{isUpdate ? t("Изменить") : t("Добавить")}
			</div>
			<Field
				component={Fields.AntInput}
				name="name"
				type="text"
				placeholder={t("Введите название")}
				label={t("Названия")}
				size="large"
			/>
			<Field
				component={Fields.AntInput}
				name="description"
				type="text"
				placeholder={t("Введите описания")}
				label={t("Описания")}
				size="large"
			/>
			<Field
				component={Fields.AsyncSelect}
				name="stock_id"
				placeholder={t("Склад")}
				label={t("Склад")}
				isClearable
				loadOptionsUrl={`/stocks`}
				className="mb-20"
				optionLabel={option => get(option, `translate.name`)}
				loadOptionsParams={search => {
					return {
						extra: {
							_l: tabLang
						}
					};
				}}
			/>

			<Field
				component={Fields.AntInput}
				name="order"
				type="number"
				placeholder={t("Введите порядок")}
				label={t("Порядок")}
				size="large"
			/>
			<Field
				component={Fields.AntSelect}
				name="is_active"
				label={t("Статус")}
				size="large"
				allowClear
				selectOptions={isActiveArr}
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
