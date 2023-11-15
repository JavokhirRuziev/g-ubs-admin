import React, { useEffect } from "react";
import axios from "axios";
import config from "config";
import { Field, Formik } from "formik";
import { Fields } from "components";
import { get } from "lodash";

export default function Filters({
	search,
	setSearch,
	filteredOptions,
	setFilteredOptions,
	category,
	setCategory,
	product,
	setProduct,
	stock_id,
	setStock_id,
	product_category_id,
	setProduct_category_id,
	t,
	tabLang,
	query
}) {
	useEffect(() => {
		axios
			.get(
				`${config.API_ROOT}/product-categories?_l=${tabLang}&include=translate,stock`
			)
			.then(res => {
				const categoryData = res.data.data;
				const newCategories = categoryData
					.filter(item => {
						if (item.stock.translate.stock_id === stock_id) {
							return item;
						}
					})
					.map(category => ({
						name: category.translate && category.translate.name,
						value:
							category.translate &&
							category.translate.product_category_id,
						stock_id:
							category.stock.translate &&
							category.stock.translate.stock_id
					}));
				setCategory(newCategories);
			})
			.catch(err => console.log(err));
	}, [stock_id]);

	useEffect(() => {
		axios
			.get(
				`${config.API_ROOT}/products?_l=${tabLang}&include=translate,stock,category`
			)
			.then(res => {
				const categoryData = res.data.data;
				const newCategories = categoryData
					.filter(item => {
						if (item.product_category_id === product_category_id) {
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
	}, [product_category_id]);

	return (
		<div
			style={{
				display: "flex",
				columnGap: "10px",
				rowGap: "10px",
				flexWrap: "wrap",
				width: "80%"
			}}>
			<Formik
				initialValues={{
					category: query.category_name && query.category_name
				}}>
				{({ setFieldValue, values }) => (
					<>
						<div style={{ width: "195px" }}>
							<Field
								component={Fields.AsyncSelect}
								name="stock_id"
								placeholder={t("Склад")}
								isClearable
								loadOptionsUrl={`/stocks`}
								optionValue="id"
								optionLabel={option =>
									get(option, `translate.name`)
								}
								style={{
									marginBottom: "0px"
								}}
								onChange={option => {
									setFieldValue("stock_id", option);
									setStock_id(
										option &&
											get(option, "translate.stock_id")
									);
									setSearch({
										...search,
										stock: get(option, "translate.stock_id")
									});
								}}
								loadOptionsParams={search => {
									return {
										include: "translate",
										extra: {
											_l: tabLang
										},
										search
									};
								}}
							/>
						</div>
						<div style={{ width: "195px" }}>
							<Field
								component={Fields.AntSelect}
								name="category"
								placeholder={t("Категория")}
								size={"large"}
								style={{
									marginBottom: "0px"
								}}
								inputStyles={{ width: "100%" }}
								allowClear
								value={values.category}
								onChange={(value, option) => {
									setSearch({
										...search,
										category: value
									});
									setFieldValue(
										"category",
										get(option, "props.children")
									);
									setProduct_category_id(value);
								}}
								selectOptions={
									filteredOptions &&
									filteredOptions.category &&
									filteredOptions.category
										? filteredOptions.category
										: category
								}
								showSearch
								optionFilterProp="children"
								onSearch={value => {
									const filteredOptions = category.filter(
										option =>
											option.name
												.toLowerCase()
												.includes(value.toLowerCase())
									);
									setFilteredOptions({
										...filteredOptions,
										category: filteredOptions
									});
								}}
								filterOption={(input, option) =>
									option.props.children
										.toLowerCase()
										.indexOf(input.toLowerCase()) >= 0
								}
							/>
						</div>
						<div style={{ width: "195px" }}>
							<Field
								component={Fields.AntSelect}
								name="product"
								placeholder={t("Продукты")}
								size={"large"}
								style={{
									marginBottom: "0px"
								}}
								inputStyles={{ width: "100%" }}
								allowClear
								onChange={(value, option) => {
									setSearch({
										...search,
										product: value
									});
									setFieldValue(
										"product",
										get(option, "props.children")
									);
								}}
								selectOptions={
									filteredOptions &&
									filteredOptions.product &&
									filteredOptions.product
										? filteredOptions.product
										: product
								}
								showSearch
								optionFilterProp="children"
								onSearch={value => {
									const filteredOptions = product.filter(
										option =>
											option.name
												.toLowerCase()
												.includes(value.toLowerCase())
									);
									setFilteredOptions({
										...filteredOptions,
										product: filteredOptions
									});
								}}
								filterOption={(input, option) =>
									option.props.children
										.toLowerCase()
										.indexOf(input.toLowerCase()) >= 0
								}
							/>
						</div>
						<div>
							<Field
								component={Fields.AntInput}
								name="from_sum"
								type="number"
								allowClear
								placeholder={t("От")}
								value={search.sum.from}
								onChange={e =>
									setSearch({
										...search,

										sum: {
											from: e.target.value,
											to: search.sum.to
										}
									})
								}
								size="large"
								style={{ marginBottom: "0px", width: "195px" }}
							/>
						</div>
						<div>
							<Field
								component={Fields.AntInput}
								name="to_sum"
								type="number"
								allowClear
								placeholder={t("До")}
								value={search.sum.to}
								onChange={e =>
									setSearch({
										...search,
										sum: {
											from: search.sum.from,
											to: e.target.value
										}
									})
								}
								size="large"
								style={{ marginBottom: "0px", width: "195px" }}
							/>
						</div>
						<div>
							<Field
								component={Fields.AntDatePicker}
								name="start_at"
								size="large"
								placeholder={t("Дата начало")}
								style={{ marginBottom: "0px", width: "190px" }}
								className={"mb-0"}
								showTime={{ format: "HH:mm" }}
								format="YYYY-MM-DD HH:mm"
								value={search.data.from}
								onChange={e => {
									setSearch({
										...search,
										data: {
											from: e,
											to: search.data.to
										}
									});
									setFieldValue("start_at", e);
								}}
							/>
						</div>
						<div>
							<Field
								component={Fields.AntDatePicker}
								name="end_at"
								size="large"
								placeholder={t("Дата окончание")}
								style={{ marginBottom: "0px", width: "190px" }}
								className={"mb-0"}
								showTime={{ format: "HH:mm" }}
								format="YYYY-MM-DD HH:mm"
								value={search.data.to}
								onChange={e => {
									setSearch({
										...search,
										data: {
											from: search.data.from,
											to: e
										}
									});
									setFieldValue("end_at", e);
								}}
							/>
						</div>
					</>
				)}
			</Formik>
		</div>
	);
}
