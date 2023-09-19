import React, { useEffect, useState } from "react";

import { Fields } from "components";
import { Field } from "formik";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import axios from "axios";
import config from "config";

const Form = ({ isUpdate, tabLang, setFieldValue }) => {
	const { t } = useTranslation("main");
	const [stock_id, setStock_id] = useState();
	const [product, setProduct] = useState();

	useEffect(() => {
		axios
			.get(
				`${config.API_ROOT}/products?_l=${tabLang}&include=translate,stock,category`
			)
			.then(res => {
				const categoryData = res.data.data;
				const newCategories = categoryData
					.filter(item => {
						if (item.stock_id === stock_id) {
							return item;
						}
					})
					.map(category => ({
						name: category.translate && category.translate.name,
						value: category && category.id
					}));
				setProduct(newCategories);
			})
			.catch(err => console.log(err));
	}, [stock_id]);

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
				onChange={option => {
					setFieldValue("stock_id", option);
					setStock_id(option && option.id);
				}}
				loadOptionsParams={search => {
					return {
						include: "translate",
						extra: {
							_l: tabLang
						}
					};
				}}
			/>

			<Field
				component={Fields.AntSelect}
				name="product_id"
				label={t("Продукты")}
				size={"large"}
				allowClear
				onChange={option => setFieldValue("product_id", option)}
				selectOptions={product}
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
