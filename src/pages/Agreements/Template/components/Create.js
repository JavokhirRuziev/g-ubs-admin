import React from "react";
import Form from "./Form";
import axios from "axios";
import config from "config";
import { Formik } from "formik";

const Create = ({ showCreateModal }) => {
	const handleFormSubmit = async (values, { resetForm, setSubmitting }) => {
		try {
			const formData = new FormData();
			formData.append("title", values.title);
			formData.append("file", values.file);
			formData.append("order", values.order);
			formData.append("is_active", values.is_active ? 1 : 0);

			const response = await axios.post(
				`${config.API_ROOT}/templates`,
				formData
			);

			if (response.status === 200) {
				resetForm();
				showCreateModal(false);
				window.location.reload();
			} else {
			}
		} catch (error) {
			console.error("Error submitting form:", error);
		} finally {
			setSubmitting(false);
		}
	};
	return (
		<Formik
			initialValues={{
				title: "",
				file: "",
				order: "",
				is_active: false
			}}
			onSubmit={handleFormSubmit}>
			{({ values, setFieldValue, handleSubmit }) => (
				<form onSubmit={handleSubmit}>
					<Form {...{ isUpdate: false, values, setFieldValue }} />
				</form>
			)}
		</Formik>
	);
};

export default Create;
