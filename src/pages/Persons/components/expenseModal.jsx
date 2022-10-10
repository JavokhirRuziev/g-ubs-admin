import React from "react";
import {Button, Radio, Spin, Switch} from "antd";
import EntityForm from "modules/entity/forms";
import { Field } from "formik";
import { Fields } from "components";
import { useTranslation } from "react-i18next";
import {DatePicker} from "antd";
import config from "config";

const AddModal = ({ showExpenseModal, id, setCanUpdate, isClient }) => {
	const { t } = useTranslation();

	return (
		<EntityForm.Main
			method="post"
			entity="transaction"
			name={`customer-${id}`}
			url="/transactions"
			prependData={true}
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				showExpenseModal(false);
				setCanUpdate(value => !value)
			}}
			params={{ include: "category" }}
			fields={[
				{
					name: "category_id",
					onSubmitValue: value => value ? value.id : "",
					required: true
				},
				{
					name: "customer_id",
					value: id,
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
					name: 'for_creditor',
					value: false,
					onSubmitValue: value => value ? 1 : 0
				},
				{
					name: 'prepayment',
					value: false,
					onSubmitValue: value => value ? 1 : 0
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
								loadOptionsKey={data => {
									if(isClient){
										const sale = data.data.find(a => a.alias === 'sale');
										return [sale]
									}else return data.data
								}}
								loadOptionsParams={search => {
									return {
										filter: {type: config.EXPENSE_CATEGORY_TYPE},
										extra: { name: search }
									};
								}}
							/>

							<Radio.Group className="d-flex flex-wrap mb-20" value={values.price_type}
										 onChange={e => setFieldValue("price_type", e.target.value)}>
								<Radio value={1}>{t("Наличние")}</Radio>
								<Radio value={4}>{t("Терминал")}</Radio>
								<Radio value={7}>{t("Онлайн")}</Radio>
								{(!values.for_creditor && !values.prepayment) && (
									<>
										<div className='mt-10'>
											<Radio value={10}>{t("За долг")}</Radio>
										</div>
										<div className='mt-10'>
											<Radio value={11}>{t("От должника")}</Radio>
										</div>
									</>
								)}

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

							<div className="d-flex align-items-center mb-20">
								<Switch
									onChange={value => {
										setFieldValue('for_creditor', value)
										if(values.price_type === 10){
											setFieldValue('price_type', 1)
										}
									}}
									checked={values.for_creditor}
								/>
								<div className="ant-label mb-0 ml-10">{t('Закрыть кредиторку')}</div>
							</div>

							<div className="d-flex align-items-center mb-20">
								<Switch
									onChange={value => {
										setFieldValue('prepayment', value)
										if(values.price_type === 10){
											setFieldValue('price_type', 1)
										}
									}}
									checked={values.prepayment}
								/>
								<div className="ant-label mb-0 ml-10">{t('Передоплата')}</div>
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
