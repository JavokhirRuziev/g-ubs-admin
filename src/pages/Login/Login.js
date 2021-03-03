import React from "react";
import { Field, Form, withFormik } from "formik";
import * as Yup from "yup";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Fields from "components/Fields";
import Actions from "store/actions";
import {Button, notification, Spin} from "antd";
import get from "lodash/get";

import "./style.scss";
import bgImage from "./icons/login-bg.svg";

const Login = ({ isSubmitting }) => {
	return (
		<div className="login-page">
			<div className="container">
				<div className="login-page__inner">
					<div className="login-box">
						<div className="login-box__header">
							<div>
								<div className="login-box__title">Добро пожаловать</div>
								<div className="login-box__subtitle">Панель управления сайтом MBP</div>
							</div>
						</div>
						<div className="login-box__form">
							<Spin spinning={isSubmitting}>
								<Form autoComplete="false">
									<Field
										component={Fields.TextInputLogin}
										name="name"
										type="text"
										title="Введите логин"
									/>
									<Field
										component={Fields.PasswordInputLogin}
										name="password"
										type="password"
										title="Введите пароль"
									/>
									<Button type="primary" htmlType="submit" block>Войти</Button>
								</Form>
							</Spin>
						</div>
					</div>
					<img className="login-page__bg" src={bgImage} alt=""/>
				</div>
			</div>
		</div>
	);
};

const enhacedLogin = withFormik({
	validationSchema: () => (
		Yup.object().shape({
			name: Yup.string().required("Required"),
			password: Yup.string().required("Required")
		})
	),
	mapPropsToValues: () => ({
		name: "",
		password: ""
	}),
	handleSubmit: (values, { props, setFieldError, setSubmitting }) => {

		props.LoginRequest({
			values,
			cb: {
				success: () => {},
				error: (errors) => {
					if (errors instanceof Array) {
						errors.map(({ field, message }) => setFieldError(field, message));
					} else if(get(errors, 'errorMessage')){
						notification["error"]({
							message: get(errors, 'errorMessage', 'Что-то пошло не так'),
							duration: 2
						});
					} else if (errors instanceof Object) {
						Object.keys(errors).map(field => {
							const error = errors[field][0];
							return setFieldError(field, error);
						});
					}
				},
				finally: () => {
					setSubmitting(false);
				}
			}
		});
	}
})(Login);

const mapDispatchToProps = (dispatch) => bindActionCreators(
	{
		LoginRequest: Actions.auth.Login.request
	},
	dispatch
);

export default connect(null, mapDispatchToProps)(enhacedLogin);