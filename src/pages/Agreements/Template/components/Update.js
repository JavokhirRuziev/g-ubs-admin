import React from "react";
import { Spin } from "antd";
import Form from "./Form";
import get from "lodash/get";
import EntityContainer from "modules/entity/containers";
import { Formik } from "formik";
import axios from "axios";
import config from "config";

const Update = ({ tabLang, selected, showUpdateModal, id }) => {
	const handleFormSubmit = async (values, { resetForm, setSubmitting }) => {
		try {
			const formData = new FormData();
			formData.append("title", values.title);
			formData.append("file", values.file);
			formData.append("order", values.order);
			formData.append("is_active", values.is_active ? 1 : 0);

			const response = await axios.put(
				`${config.API_ROOT}/templates/${get(selected, "id")}`,
				{ ...values }
			);

			if (response.status === 200) {
				resetForm();
				showUpdateModal(false);
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
		<EntityContainer.One
			entity={`templates`}
			name={get(selected, "id")}
			url={`/templates/${get(selected, "id")}`}
			primaryKey="id"
			id={get(selected, "id")}
			params={{
				extra: { _l: tabLang }
			}}>
			{({ item, isFetched }) => {
				return (
					<Formik
						initialValues={{
							title: get(item, "title"),
							// file: {
							// 	uid: "0",
							// 	name: get(item, "file"),
							// 	status: "done"
							// },
							order: get(item, "order"),
							is_active: get(item, "is_active")
						}}
						onSubmit={handleFormSubmit}>
						{({ values, setFieldValue, handleSubmit }) => (
							<form onSubmit={handleSubmit}>
								<Spin spinning={!isFetched}>
									<Form
										{...{
											isUpdate: true,
											values,
											setFieldValue
										}}
									/>
								</Spin>
							</form>
						)}
					</Formik>
				);
			}}
		</EntityContainer.One>
	);
};

export default Update;
