import React from "react";

import { Fields } from "components";
import { Field } from "formik";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import get from "lodash/get";

const Form = ({ isUpdate, tabLang }) => {
	const { t } = useTranslation("main");

	return (
		<div>
			<div className="title-md fs-16 mb-20">
				{isUpdate ? t("Изменить") : t("Добавить")}
			</div>
			<Field
				component={Fields.AsyncSelect}
				name="stock_id"
				placeholder={t("Склад")}
				label={t("Склад")}
				isClearable
				loadOptionsUrl={`/stocks`}
				className="mb-20"
				optionValue="id"
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
				component={Fields.AsyncSelect}
				name="product_id"
				placeholder={t("Продукты")}
				label={t("Продукты")}
				isClearable
				loadOptionsUrl={`/products`}
				className="mb-20"
				optionValue="id"
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
				name="count"
				type="number"
				placeholder={t("Введите количество")}
				label={t("Количество")}
				size="large"
			/>
			<Field
				component={Fields.AntInput}
				name="price"
				type="number"
				placeholder={t("Введите цену")}
				label={t("Цена")}
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
