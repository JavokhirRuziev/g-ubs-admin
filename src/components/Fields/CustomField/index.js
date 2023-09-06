import { Button } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

export default function CustomField({ onSubmit, children }) {
	const { t } = useTranslation("main");
	return (
		<form onSubmit={onSubmit} className="regist_form">
			<div>{children}</div>
			<Button type="primary" htmlType="submit" block className="ant-btn">
				{t("Подтвердить")}
			</Button>
		</form>
	);
}
