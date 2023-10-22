import React from "react";

import { Fields } from "components";
import { Field } from "formik";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import get from "lodash/get";

const IngredientsForm = ({ isUpdate, submitForm, lang, selected, values }) => {
	const { t } = useTranslation("main");

	return (
		<div>
			<div className="title-md fs-16 mb-20">
				{isUpdate ? t("Изменить") : t("Добавить")}
			</div>

			<Field
				component={Fields.AsyncSelect}
				name="finished_dish_id"
				placeholder={t("Готовое блюдо")}
				isClearable
				loadOptionsUrl={`/search/finished-dishes`}
				className="mb-20"
				optionValue={"id"}
				optionLabel={option => get(option, `translate.name`)}
				isSearchable
				loadOptionsParams={search => {
					return {
						extra: {
							_l: lang,
							include: "translate",
							search: search
						}
					};
				}}
				value={selected}
			/>

			<Field
				component={Fields.AntInput}
				name="count"
				type="number"
				placeholder={t("Количество")}
				size="large"
			/>

			<Button
				type="primary"
				size="large"
				className="fs-14 fw-300"
				htmlType="button"
				onClick={() => {
					submitForm();
				}}
				disabled={values.auto_calculation}>
				{isUpdate ? t("Сохранить") : t("Добавить")}
			</Button>
		</div>
	);
};

export default IngredientsForm;
