import React, { useEffect, useState } from "react";

import { Fields } from "components";
import { Field } from "formik";
import { Button, Switch } from "antd";
import { useTranslation } from "react-i18next";

import axios from "axios";
import config from "config";
import get from "lodash/get";
import moment from "moment";

const Form = ({ values, isUpdate, tabLang, setFieldValue, item }) => {
	const { t } = useTranslation("main");
	const [categories, setCategories] = useState([]);
	const [stock, setStock] = useState(get(item, "stock.id"));
	const [filteredOptions, setFilteredOptions] = useState();
	const [search, setSearch] = useState("");

	useEffect(() => {
		axios
			.get(
				`${config.API_ROOT}/product-categories?_l=${tabLang}&include=translate&search=${search}`
			)
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
				setFilteredOptions(newCategories);
			})
			.catch(err => console.log(err));
	}, [stock]);
	return (
		<div>
			<div className="title-md fs-16 mb-20">
				{isUpdate ? t("Изменить") : t("Добавить")}
			</div>
			<Field
				component={Fields.AsyncSelect}
				name="client_company_id"
				placeholder={t("Клиент")}
				isClearable
				loadOptionsUrl={`/search/clients`}
				className="mb-20"
				optionValue="id"
				optionLabel={option => get(option, `name`)}
				isSearchable={true}
				loadOptionsParams={search => {
					return {
						extra: {
							_l: tabLang,
							search
						}
					};
				}}
			/>
			<Field
				component={Fields.AntInput}
				name="contract_number"
				type="number"
				placeholder={t("Договора")}
				label={t("Номер договора")}
				size="large"
			/>
			<Field
				component={Fields.AntDatePicker}
				name="contract_date"
				size="large"
				placeholder={t("Дата договора")}
				style={{ width: "100%", marginBottom: 0 }}
				className={"mb-0"}
				format="YYYY-MM-DD"
				onChange={date => {
					setFieldValue("contract_date", date);
				}}
			/>
			<Field
				component={Fields.AntInput}
				name="client_name"
				type="text"
				placeholder={t("Введите имя")}
				label={t("Имя клиента")}
				size="large"
			/>
			<Field
				component={Fields.AntInput}
				name="client_address"
				type="text"
				placeholder={t("Введите адрес")}
				label={t("Адрес клиента")}
				size="large"
			/>
			<Field
				component={Fields.AntInput}
				name="client_phone"
				type="text"
				placeholder={t("Введите номер")}
				label={t("Телефонный номер")}
				size="large"
			/>
			<Field
				component={Fields.AntInput}
				name="mfo"
				type="text"
				placeholder={t("МФО (Пятизначный код банка)")}
				label={t("МФО (Пятизначный код банка)")}
				size="large"
			/>
			<Field
				component={Fields.AntInput}
				name="bank"
				type="text"
				placeholder={t("Банк (филиал банка)")}
				label={t("Банк (филиал банка)")}
				size="large"
			/>
			<Field
				component={Fields.AntInput}
				name="checking_account"
				type="number"
				placeholder={t("Расчетный счет клиента")}
				label={t("Расчетный счет клиента")}
				size="large"
			/>
			<Field
				component={Fields.AntInput}
				name="tin"
				type="text"
				placeholder={t("ИНН клиента")}
				label={t("ИНН клиента")}
				size="large"
			/>
			<Field
				component={Fields.AntInput}
				name="oked"
				type="text"
				placeholder={t("ОКЭД")}
				label={t("ОКЭД")}
				size="large"
			/>
			<Field
				component={Fields.AntInput}
				name="vat_code"
				type="text"
				placeholder={t("Код НДС")}
				label={t("Код НДС")}
				size="large"
			/>
			<Field
				component={Fields.AntInput}
				name="director_name"
				type="text"
				placeholder={t("ФИО директора")}
				label={t("ФИО директора")}
				size="large"
			/>
			<Field
				component={Fields.AntInput}
				name="client_position"
				type="text"
				placeholder={t("Должность руководителя клиента")}
				label={t("Должность руководителя клиента")}
				size="large"
			/>
			<Field
				component={Fields.AntInput}
				name="client_name_declination"
				type="text"
				placeholder={t("ФИО склонение (Клиент)")}
				label={t("ФИО склонение (Клиент)")}
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
