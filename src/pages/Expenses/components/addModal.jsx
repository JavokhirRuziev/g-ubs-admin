import React from "react";
import { Button, Radio, Spin } from "antd";
import EntityForm from "modules/entity/forms";
import { Field } from "formik";
import { Fields } from "components";
import get from "lodash/get";
import { useTranslation } from "react-i18next";
import {DatePicker} from "antd";
import config from "config";

const AddModal = ({ showAddModal, selectedCategory }) => {
	const {t} = useTranslation("main");
	const alias = get(selectedCategory, 'alias');
	const getTypeByCategory = (alias) => {
		switch (alias){
			case "market":
				return 3;
			case "work_fee":
				return 2
		}
	}

	return (
		<EntityForm.Main
			method="post"
			entity="expenses"
			name={`all-${get(selectedCategory, "id")}`}
			url="/transactions"
			prependData={true}
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				showAddModal(false);
			}}
			params={{ include: "category,customer" }}
			fields={[
				{
					name: "category_id",
					value: selectedCategory ? selectedCategory : null,
					onSubmitValue: value => value ? value.id : "",
					required: true
				},
				{
					name: "customer_id",
					onSubmitValue: value => value ? value.id : ""
				},
				{
					name: "company_id",
					value: null,
				},
				{
					name: "value",
					required: true,
					onSubmitValue: value => value && Number(value)
				},
				{
					name: "price_type",
					value: 1
				},
				{
					name: "comment"
				},
				{
					name: 'type',
					value: 1
				},
				{
					name: 'added_at',
					required: true,
				}
			]}
		>
			{({ isSubmitting, values, setFieldValue }) => {
				return (
					<Spin spinning={isSubmitting}>
						<div>
							<div className="title-md fs-16 mb-20">{t("Добавление расходов")}</div>
							<Field
								component={Fields.AsyncSelect}
								name="category_id"
								placeholder={t("Виберите категорию")}
								isClearable
								loadOptionsUrl={`/expense-categories`}
								className="mb-20"
								optionLabel="title"
								optionValue="id"
								isSearchable
								isDisabled={!!selectedCategory}
								loadOptionsParams={search => {
									return {
										filter: {type: config.EXPENSE_CATEGORY_TYPE},
										extra: { name: search }
									};
								}}
							/>

							{(alias === 'market' || alias === 'work_fee') && (
								<Field
									component={Fields.AsyncSelect}
									name="customer_id"
									placeholder={t("Виберите клинта")}
									isClearable
									loadOptionsUrl={`/customers`}
									className="mb-20"
									optionLabel="name"
									optionValue="id"
									isSearchable
									loadOptionsParams={search => {
										return {
											filter: {
												type: getTypeByCategory(alias),
											},
											extra: { name: search }
										};
									}}
								/>
							)}

							<Radio.Group className="d-flex flex-wrap mb-20" defaultValue={values.price_type}
								onChange={e => setFieldValue("price_type", e.target.value)}>
								<Radio value={1}>{t("Наличние")}</Radio>
								<Radio value={4}>{t("Терминал")}</Radio>
								<Radio value={7}>{t("Онлайн")}</Radio>
								<div className='mt-10'>
									<Radio value={10}>{t("За долг")}</Radio>
								</div>
							</Radio.Group>

							<Field
								component={Fields.AntInput}
								name="value"
								type="text"
								onChange={event => {
									setFieldValue("value", event.target.value.replace(/\$\s?|(,*)/g, ""));
								}}
								value={values.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
								placeholder={t("Введите сумму")}
								size="large"
							/>

							<Field
								component={Fields.AntTextarea}
								name="comment"
								type="text"
								placeholder={t("Введите комментария")}
								size="large"
							/>

							<div className="mb-24">
								<div className="ant-label mr-6 mb-3">{t("Дата")}</div>
								<Field
									allowClear={false}
									value={values.added_at}
									component={DatePicker}
									name="added_at"
									size="large"
									clear
									format="YYYY-MM-D HH:m:s"
									placeholder={t("Выберите дату")}
									onChange={(date) => {
										setFieldValue('added_at', date)
									}}
								/>
							</div>

							<Button
								type="primary"
								size="large"
								className="fs-14 fw-300"
								htmlType="submit"
							>{t("Добавить")}</Button>
						</div>

					</Spin>
				);
			}}
		</EntityForm.Main>
	);
};

export default AddModal;
