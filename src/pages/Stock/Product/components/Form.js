import React, { useEffect, useState } from "react";

import { Fields } from "components";
import { Field } from "formik";
import { Button, Switch } from "antd";
import { useTranslation } from "react-i18next";

import axios from "axios";
import config from "config";
import get from "lodash/get";

const Form = ({ values, isUpdate, tabLang, setFieldValue }) => {
	const { t } = useTranslation("main");
	const [categories, setCategories] = useState([]);
	const [stock, setStock] = useState();

	useEffect(() => {
		axios
			.get(`${config.API_ROOT}/product-categories?_l=${tabLang}`)
			.then(res => {
				const categoryData = res.data.data;
				const newCategories = categoryData
					.filter(item => item.stock_id === stock)
					.map(category => ({
						name: category.translate && category.translate.name,
						value:
							category.translate &&
							category.translate.product_category_id
					}));
				setCategories(newCategories);
			})
			.catch(err => console.log(err));
	}, [stock]);

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
				isClearable
				loadOptionsUrl={`/stocks`}
				className="mb-20"
				optionValue="id"
				optionLabel={option => get(option, `translate.name`)}
				onChange={option => setStock(option.translate.stock_id)}
				loadOptionsParams={search => {
					return {
						extra: {
							_l: tabLang
						}
					};
				}}
			/>
			<Field
				component={Fields.AntSelect}
				name="product_category_id"
				label={t("Категория")}
				size={"large"}
				allowClear
				onChange={option =>
					setFieldValue("product_category_id", option)
				}
				selectOptions={categories}
			/>
			<Field
				component={Fields.AsyncSelect}
				name="unit_id"
				placeholder={t("Ед изм")}
				isClearable
				loadOptionsUrl={`/units`}
				className="mb-20"
				optionValue="id"
				optionLabel={option => get(option, `title_${tabLang}`)}
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
				component={Fields.AntInput}
				name="deficit_threshold"
				type="number"
				placeholder={t("Введите порог дефицита")}
				label={t("Порог дефицита")}
				size="large"
			/>
			<Field
				component={Fields.AntInput}
				name="average_quantity"
				type="number"
				placeholder={t("Введите среднее количество")}
				label={t("Среднее количество")}
				size="large"
			/>

			<div className="d-flex align-items-center mb-24">
				<Switch
					onChange={value => {
						setFieldValue("is_active", value);
					}}
					checked={values.is_active}
				/>
				<div className="ant-label mb-0 ml-10">
					{t("Активный статус")}
				</div>
			</div>

			{console.log(values)}
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
