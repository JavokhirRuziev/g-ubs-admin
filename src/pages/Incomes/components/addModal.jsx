import React from "react";
import { Button, Radio, Spin } from "antd";
import EntityForm from "modules/entity/forms";
import { Field } from "formik";
import { Fields } from "components";
import get from "lodash/get";
import { useTranslation } from "react-i18next";
import {DatePicker} from "antd";

const AddModal = ({ showAddModal }) => {
	const { t } = useTranslation();

	return (
		<EntityForm.Main
			method="post"
			entity="incomes"
			name={`all`}
			url="/transactions"
			prependData={true}
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				showAddModal(false);
			}}
			params={{ include: "customer" }}
			fields={[
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
					name: "added_at",
					required: true
				},
				{
					name: 'type',
					value: 2
				}
			]}
		>
			{({ isSubmitting, values, setFieldValue }) => {
				return (
					<Spin spinning={isSubmitting}>
						<div>
							<div className="title-md fs-16 mb-20">{t("Добавление приход")}</div>

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
									component={Fields.AntDatePicker}
									name="added_at"
									size="large"
									placeholder={t("Выберите дату")}
									style={{width: '100%', marginBottom: 0}}
									format="YYYY-MM-DD HH:mm"
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
