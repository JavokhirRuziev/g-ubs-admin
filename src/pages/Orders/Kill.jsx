import React from 'react';

import { Button, notification, Spin } from "antd";
import EntityForm from 'modules/entity/forms';
import { Field } from "formik";
import { Fields } from "../../components";
import get from "lodash/get";
import { useTranslation } from "react-i18next";

const Create = ({showKillModal}) => {
	const {t} = useTranslation("main");

	return (
		<EntityForm.Default
			method="post"
			url="/user/kill-me"
			onSuccess={(data, resetForm) => {
				resetForm();
				showKillModal(false);
				notification["success"]({
					message: "Успешно!",
					duration: 2
				});
				window.location.reload()
			}}
			selfErrorMessage={true}
			onError={(error) => {
				const errorMessage = get(error, 'errorMessage');
				notification["error"]({
					message: errorMessage,
					duration: 2
				});
				window.location.reload()
			}}
			fields={[
				{
					name: "secret_key",
					required: true,
					value: ''
				}
			]}
		>
			{({isSubmitting, values, setFieldValue}) => {
				return (
					<Spin spinning={isSubmitting}>

						<div>
							<div className="title-md fs-16 mb-20">#unknown action</div>
							<Field
								component={Fields.AntInput}
								type="text"
								name={"secret_key"}
								placeholder={t("Введите secret key")}
								label={t("SECRET KEY")}
								size="large"
							/>

							<Button
								type="primary"
								size="large"
								className="fs-14 fw-300"
								htmlType="submit"
							>{t("Отправить")}</Button>
						</div>

					</Spin>
				);
			}}
		</EntityForm.Default>
	);
};

export default Create;