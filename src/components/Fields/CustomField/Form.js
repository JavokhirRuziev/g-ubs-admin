import { Spin, notification } from "antd";
import { Formik } from "formik";
import CustomField from ".";
import Field from "./Field";
import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useTranslation } from "react-i18next";
import config from "config";

export default function Form() {
	const history = useHistory();
	const [err, setErr] = useState();
	const [isMessage, setIsMessage] = useState();
	const { t } = useTranslation("main");
	return (
		<Formik
			initialValues={{
				name: "",
				surname: "",
				phone: "+998",
				email: "",
				login: "",
				password: "",
				password_confirmation: "",
				company_name: "",
				code: ""
			}}
			validate={values => {
				const errors = {};
				if (!isMessage) {
					if (!values.name) {
						errors.name = "Required";
					} else if (values.name.length < 3) {
						errors.name = "Too short";
					} else if (!values.surname) {
						errors.surname = "Required";
					} else if (!values.phone) {
						errors.phone = "Required";
					} else if (values.phone.length < 13) {
						errors.phone = "Too short";
					} else if (values.phone.length > 13) {
						errors.phone = "Too long";
					} else if (values.surname.length < 3) {
						errors.surname = "Too short";
					} else if (!values.phone) {
						errors.phone = "Required";
					} else if (!values.email) {
						errors.email = "Required";
					} else if (
						!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
							values.email
						)
					) {
						errors.email = "Invalid email address";
					} else if (!values.login) {
						errors.login = "Required";
					} else if (values.login.length < 3) {
						errors.login = "Too short";
					} else if (!values.company_name) {
						errors.company_name = "Required";
					} else if (values.company_name.length < 3) {
						errors.company_name = "Too short";
					} else if (!values.password) {
						errors.password = "Required";
					} else if (values.password.length < 4) {
						errors.password =
							"Password must be at least 4 characters";
					} else if (!values.password_confirmation) {
						errors.password_confirmation = "Required";
					} else if (
						values.password !== values.password_confirmation
					) {
						errors.password_confirmation = "Passwords do not match";
					}
				} else if (isMessage === 200) {
					if (!values.code) {
						errors.code = "Too short";
					} else if (values.code.length < 4) {
						errors.code = "Too short";
					}
				}
				return errors;
			}}
			onSubmit={(values, { setSubmitting }) => {
				if (!isMessage) {
					let formdata = new FormData();
					formdata.append("name", values.name);
					formdata.append("surname", values.surname);
					formdata.append("phone", values.phone.replace(/\s+/g, ""));
					formdata.append("email", values.email);
					formdata.append("login", values.login);
					formdata.append("password", values.password);
					formdata.append(
						"password_confirmation",
						values.password_confirmation
					);
					formdata.append("company_name", values.company_name);
					axios
						.post(`${config.API_ROOT}/user/auth/register`, formdata)
						.then(res => {
							setSubmitting(false);
							notification["warning"]({
								message: res.data.message,
								duration: 2
							});
							setIsMessage(res.status);
						})
						.catch(err => {
							setSubmitting(false);
							setErr(err.response.data.errors);
							const error =
								err.response.data.errorMessage &&
								err.response.data.errorMessage;
							error &&
								notification["error"]({
									message: error,
									duration: 2
								});
						});
				} else if (isMessage === 200) {
					let formdata = new FormData();
					formdata.append("code", values.code);
					formdata.append("name", values.name);
					formdata.append("surname", values.surname);
					formdata.append("phone", values.phone.replace(/\s+/g, ""));
					formdata.append("email", values.email);
					formdata.append("login", values.login);
					formdata.append("password", values.password);
					formdata.append(
						"password_confirmation",
						values.password_confirmation
					);
					formdata.append("company_name", values.company_name);
					axios
						.post(`${config.API_ROOT}/user/auth/register`, formdata)
						.then(res => {
							setSubmitting(false);
							history.push("/");
							notification["success"]({
								message: "Успешно отправлено",
								duration: 2
							});
						})
						.catch(err => {
							setSubmitting(false);
							notification["error"]({
								message:
									err.response.data.errorMessage &&
									err.response.data.errorMessage,
								duration: 2
							});
						});
				}
			}}>
			{({
				values,
				errors,
				touched,
				handleChange,
				handleSubmit,
				isSubmitting
			}) => (
				<Spin spinning={isSubmitting}>
					<CustomField onSubmit={handleSubmit}>
						{isMessage === 200 ? (
							<Field
								type={"text"}
								label={t("Код")}
								name={"code"}
								onChange={handleChange}
								values={values.code}
								errors={errors.code}
								touched={touched.code}
							/>
						) : (
							<div className="row">
								<div className="col-lg-6 col-md-6 col-sm-12">
									<Field
										type={"text"}
										label={t("Имя")}
										name={"name"}
										onChange={handleChange}
										values={values.name}
										errors={
											errors.name
												? errors.name
												: err && err.name && err.name[0]
										}
										touched={touched.name}
									/>
								</div>
								<div className="col-lg-6 col-md-6 col-sm-12">
									<Field
										type={"text"}
										label={t("Фамилия")}
										name={"surname"}
										onChange={handleChange}
										values={values.surname}
										errors={
											errors.surname
												? errors.surname
												: err &&
												  err.surname &&
												  err.surname[0]
										}
										touched={touched.surname}
									/>
								</div>
								<div className="col-lg-6 col-md-6 col-sm-12">
									<Field
										type={"text"}
										label={t("Номер телефона")}
										name={"phone"}
										onChange={handleChange}
										values={
											values.phone
												? "+" +
												  values.phone.replace(
														/\D/g,
														""
												  )
												: ""
										}
										errors={
											errors.phone
												? errors.phone
												: err &&
												  err.phone &&
												  err.phone[0]
										}
										touched={touched.phone}
										phone
									/>
								</div>
								<div className="col-lg-6 col-md-6 col-sm-12">
									<Field
										type={"text"}
										label={t("Электронная почта")}
										name={"email"}
										onChange={handleChange}
										values={values.email}
										errors={
											errors.email
												? errors.email
												: err &&
												  err.email &&
												  err.email[0]
										}
										touched={touched.email}
									/>
								</div>
								<div className="col-lg-6 col-md-6 col-sm-12">
									<Field
										type={"text"}
										label={t("Имя пользователя")}
										name={"login"}
										onChange={handleChange}
										values={values.login}
										errors={
											errors.login
												? errors.login
												: err &&
												  err.login &&
												  err.login[0]
										}
										touched={touched.login}
									/>
								</div>
								<div className="col-lg-6 col-md-6 col-sm-12">
									<Field
										type={"text"}
										label={t("Компания")}
										name={"company_name"}
										onChange={handleChange}
										values={values.company_name}
										errors={
											errors.company_name
												? errors.company_name
												: err &&
												  err.company_name &&
												  err.company_name[0]
										}
										touched={touched.company_name}
									/>
								</div>
								<div className="col-lg-6 col-md-6 col-sm-12">
									<Field
										type={"password"}
										label={t("Пароль")}
										name={"password"}
										onChange={handleChange}
										values={values.password}
										errors={
											errors.password
												? errors.password
												: err &&
												  err.password &&
												  err.password[0]
										}
										touched={touched.password}
									/>
								</div>
								<div className="col-lg-6 col-md-6 col-sm-12">
									<Field
										type={"password"}
										label={t("Подтвердить")}
										name={"password_confirmation"}
										onChange={handleChange}
										values={values.password_confirmation}
										errors={
											errors.password_confirmation
												? errors.password_confirmation
												: err &&
												  err.password_confirmation &&
												  err.password_confirmation[0]
										}
										touched={touched.password_confirmation}
									/>
								</div>
							</div>
						)}
					</CustomField>
				</Spin>
			)}
		</Formik>
	);
}
