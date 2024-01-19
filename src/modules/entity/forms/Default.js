import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withFormik } from "formik";
import * as Yup from "yup";
import get from "lodash/get";
import isArray from "lodash/isArray";
import objectToFormData from "object-to-formdata";
import PropTypes from "prop-types";
import { notification } from "antd";
import Actions from "../actions";

const Main = ({
	children,
	handleSubmit,
	submitForm,
	values,
	isSubmitting,
	setFieldValue,
	setFieldError,
	setFieldTouched
}) => (
	<form onSubmit={handleSubmit}>
		{children({
			handleSubmit,
			submitForm,
			values,
			isSubmitting,
			setFieldValue,
			setFieldError,
			setFieldTouched
		})}
	</form>
);

Main.propTypes = {
	url: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
	method: PropTypes.oneOf(["get", "post", "put", "delete"]).isRequired,
	fields: PropTypes.array.isRequired,
	sendAsFormData: PropTypes.bool,
	onSuccess: PropTypes.func,
	onError: PropTypes.func
};

Main.defaultProps = {
	onSuccess: () => {},
	onError: () => {}
};

const EnhacedForm = withFormik({
	enableReinitialize: true,
	validationSchema: ({ fields }) => {
		if (!isArray(fields)) {
			return Yup.object().shape({});
		}

		let validationFields = {};

		fields.forEach(field => {
			let validationField;

			switch (field.type) {
				case "string":
					validationField = Yup.string().typeError(
						"Must be a string"
					);
					break;
				case "object":
					validationField = Yup.object();
					break;
				case "number":
					validationField = Yup.number().typeError(
						"Must be a number"
					);
					break;
				case "array":
					validationField = Yup.array();
					break;
				case "boolean":
					validationField = Yup.boolean();
					break;
				case "date":
					validationField = Yup.date();
					break;
				default:
					validationField = Yup.string();
			}

			if (field.required) {
				validationField = validationField.required("Required");
			}

			if (field.min) {
				validationField = validationField.min(field.min, "Too Short!");
			}

			if (field.max) {
				validationField = validationField.max(field.max, "Too Long!");
			}

			validationField = validationField.nullable();

			validationFields[field.name] = validationField;
		});

		return Yup.object().shape(validationFields);
	},
	mapPropsToValues: ({ fields }) => {
		return isArray(fields)
			? fields.reduce(
					(prev, curr) => ({
						...prev,
						[curr.name]: curr.isAbsolute
							? curr.value
							: get(curr, "value", "")
					}),
					{}
			  )
			: {};
	},
	handleSubmit: (
		values,
		{ props, setFieldError, setSubmitting, resetForm }
	) => {
		let {
			url,
			params,
			method,
			fields,
			sendAsFormData,
			onSuccess = () => {},
			onError = () => {},
			FormAction,
			selfErrorMessage
		} = props;

		values = { ...values };

		if (typeof url === "function") {
			url = url({ ...values });
		}

		fields.forEach(field => {
			if (field.hasOwnProperty("onSubmitValue")) {
				if (typeof field.onSubmitValue === "function") {
					if (field.hasOwnProperty("onSubmitKey")) {
						values[field.onSubmitKey] = field.onSubmitValue(
							values[field.name],
							values
						);
						delete values[field.name];
					} else {
						values[field.name] = field.onSubmitValue(
							values[field.name],
							values
						);
					}
				}
			}
			if (field.hasOwnProperty("disabled")) {
				delete values[field.name];
			}
		});

		if (sendAsFormData) {
			values = objectToFormData(values);
			// values.append('_method', 'PUT');
		}

		FormAction({
			url,
			params,
			method,
			values,
			cb: {
				success: data => {
					notification["success"]({
						message: data.message ? data.message : "Успешно",
						duration: 2
					});
					onSuccess(data, resetForm);
				},
				error: (errors = []) => {
					if (!selfErrorMessage) {
						notification["error"]({
							message: errors && errors.message && errors.message,
							duration: 3
						});
					}

					if (errors instanceof Array) {
						errors.map(({ field, message }) =>
							setFieldError(field, message)
						);
					} else if (errors instanceof Object) {
						Object.keys(errors).map(field => {
							const error = errors[field][0];
							return setFieldError(field, error);
						});
					}

					onError(errors, setFieldError);
				},
				finally: () => {
					setSubmitting(false);
				}
			}
		});
	}
})(Main);

const mapDispatchToProps = dispatch =>
	bindActionCreators(
		{
			FormAction: Actions.FormDefault.request
		},
		dispatch
	);

export default connect(null, mapDispatchToProps)(EnhacedForm);
