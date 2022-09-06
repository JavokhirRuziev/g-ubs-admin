import React from "react";
import { Button, Radio, Spin } from "antd";
import EntityForm from "modules/entity/forms";
import { Field } from "formik";
import { Fields } from "components";
import get from "lodash/get";
import { useTranslation } from "react-i18next";
import {DatePicker} from "antd";

const AddModal = ({ showAddModal, selectedCategory, loadAccountBalance }) => {
	const { t } = useTranslation();

	return (
		<EntityForm.Main
			method="post"
			entity="expenses"
			name={`all-${get(selectedCategory, "id")}`}
			url="/expenses"
			prependData={true}
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				loadAccountBalance();
				resetForm();
				showAddModal(false);
			}}
			params={{ include: "category" }}
			fields={[
				{
					name: "category_id",
					value: selectedCategory ? selectedCategory : null,
					required: true,
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
								loadOptionsParams={search => {
									return {
										extra: { name: search }
									};
								}}
							/>

							<Radio.Group className="d-flex flex-wrap mb-20" defaultValue={values.price_type}
								onChange={e => setFieldValue("price_type", e.target.value)}>
								<Radio value={1}>{t("Наличние")}</Radio>
								<Radio value={2}>{t("Терминал")}</Radio>
								<Radio value={3}>{t("Перечисления")}</Radio>
								<Radio value={4}>{t("Вторая степенная")}</Radio>
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
									value={values.added_at}
									component={DatePicker}
									name="added_at"
									size="large"
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
