import React from "react";

import { Fields, Panel } from "components";
import { Button, Spin } from "antd";
import EntityForm from "modules/entity/forms";
import { Field } from "formik";
import { useTranslation } from "react-i18next";

const Index = ({history}) => {
	const {t} = useTranslation();

	return (
		<div>
			<div className="row">
				<div className="col-4">
					<div style={{maxWidth: "400px"}}>
						<div className={"title-md mb-10"}>Изменить пароль</div>
						<Panel className="pt-20 pb-20 pl-20 pr-20">
							<EntityForm.Main
								method={'post'}
								entity="user"
								name={`user`}
								url={`/user/update-admin`}
								updateData={true}
								primaryKey="id"
								normalizeData={data => data}
								onSuccess={(data, resetForm) => {
									resetForm();
									history.push('/logout');
								}}
								fields={[
									{
										name: "password",
										required: true
									},
									{
										name: "password_confirmation",
										required: true
									}
								]}
							>
								{({isSubmitting, values, setFieldValue}) => {

									function validate(stringValue) {
										let value = stringValue;
										let error;
										if (!value) {
											error = 'Required';
										} else if (values.password !== value) {
											error = `Не совпадает пароль`;
										}
										return error;
									}

									return (
										<Spin spinning={isSubmitting}>
											<Field
												component={Fields.AntInput}
												name="password"
												type="password"
												placeholder={t("Введите новый пароль")}
												label={t("Новый пароль")}
												size="large"
											/>
											<Field
												component={Fields.AntInput}
												name="password_confirmation"
												type="password"
												placeholder={t("Повторите новый пароль")}
												label={t("Повторите новый пароль")}
												size="large"
												validate={validate}
											/>
											<Button
												type="primary"
												size="large"
												className="fs-14 fw-300"
												htmlType="submit"
											>{"Сохранить"}</Button>
										</Spin>
									);
								}}
							</EntityForm.Main>
						</Panel>
					</div>
				</div>
				<div className="col-4">
					<div className="ml-30" style={{maxWidth: "400px"}}>
						<div className={"title-md mb-10"}>Изменить secret_key</div>
						<Panel className="pt-20 pb-20 pl-20 pr-20">
							<EntityForm.Main
								method={'post'}
								entity="user"
								name={`user`}
								url={`/user/update-admin`}
								updateData={true}
								primaryKey="id"
								normalizeData={data => data}
								onSuccess={(data, resetForm) => {
									resetForm();
								}}
								fields={[
									{
										name: "secret_key",
										required: true
									},
									{
										name: "secret_key_confirmation",
										required: true,
										disabled: true
									}
								]}
							>
								{({isSubmitting, values, setFieldValue}) => {

									function validate(stringValue) {
										let value = stringValue;
										let error;
										if (!value) {
											error = 'Required';
										} else if (values.secret_key !== value) {
											error = `Не совпадает пароль`;
										}
										return error;
									}

									return (
										<Spin spinning={isSubmitting}>
											<Field
												component={Fields.AntInput}
												name="secret_key"
												type="password"
												placeholder={t("Введите новый secret_key")}
												label={t("Новый secret_key")}
												size="large"
											/>
											<Field
												component={Fields.AntInput}
												name="secret_key_confirmation"
												type="password"
												placeholder={t("Повторите новый secret_key")}
												label={t("Повторите новый secret_key")}
												size="large"
												validate={validate}
											/>
											<Button
												type="primary"
												size="large"
												className="fs-14 fw-300"
												htmlType="submit"
											>{"Сохранить"}</Button>
										</Spin>
									);
								}}
							</EntityForm.Main>
						</Panel>
					</div>
				</div>
				<div className="col-4"/>
			</div>
		</div>
	);
};

export default Index;
