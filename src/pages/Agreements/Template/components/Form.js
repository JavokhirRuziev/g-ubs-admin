import React from "react";

import { Fields } from "components";
import { Field } from "formik";
import { Button, Switch, Upload } from "antd";
import { useTranslation } from "react-i18next";
import { UploadOutlined } from "@ant-design/icons";

const Form = ({ values, isUpdate, setFieldValue }) => {
	const { t } = useTranslation("main");

	return (
		<div>
			<div className="title-md fs-16 mb-20">
				{isUpdate ? t("Изменить") : t("Добавить")}
			</div>
			<Field
				component={Fields.AntInput}
				name="title"
				type="text"
				placeholder={t("Введите название")}
				label={t("Названия")}
				size="large"
			/>

			<Field
				component={Fields.AntInput}
				name="order"
				type="number"
				placeholder={t("Введите порядок")}
				label={t("Порядок")}
				size="large"
			/>

			{!isUpdate && (
				<Upload
					action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
					listType="file"
					defaultFileList={values.file ? [values.file] : []}
					name="file"
					onChange={e => setFieldValue("file", e.file.originFileObj)}>
					<Button>
						<UploadOutlined />
						Yuklash
					</Button>
				</Upload>
			)}
			<br />
			{console.log(values)}
			<div className="d-flex align-items-center mb-24">
				<Switch
					onChange={value => {
						setFieldValue("is_active", value);
					}}
					checked={values.is_active}
				/>
				<div className="ant-label mb-0 ml-10">
					{t("Активный статус")}
				</div>
			</div>

			<Button
				type="primary"
				size="large"
				className="fs-14 fw-300"
				htmlType="submit">
				{isUpdate ? t("Сохранить") : t("Добавить")}
			</Button>
		</div>
	);
};

export default Form;
