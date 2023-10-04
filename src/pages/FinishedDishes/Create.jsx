import React from "react";

import { Spin } from "antd";
import EntityForm from "modules/entity/forms";
import Form from "./components/Form";

import { useTranslation } from "react-i18next";
import qs from "query-string";
import { useSelector } from "react-redux";

const Create = ({ location, history }) => {
	const { t } = useTranslation("main");
	const profile = useSelector(state => state.auth.data);

	const query = qs.parse(location.search);
	const { lang } = query;

	return (
		<EntityForm.Main
			method="post"
			entity="finished-dishes"
			name={`all-${lang}`}
			url="/finished-dishes"
			prependData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				history.push(`/finished-dishes/update/${data.id}?lang=${lang}`);
			}}
			fields={[
				{
					name: "company_id",
					value: null
				},
				{
					name: "price",
					type: "number",
					required: true
				},
				{
					name: "kitchener_id",
					onSubmitValue: value => value && value.id
				},
				{
					name: "quantity",
					type: "number",
					required: true
				},
				{
					name: "unit_id",
					required: true,
					onSubmitValue: value => value && value.id
				},
				{
					name: "file_id",
					value: [],
					required: true,
					onSubmitValue: value =>
						value.length > 0 ? value[0].id : null
				},
				{
					name: "video_id",
					value: [],
					onSubmitValue: value =>
						value.length > 0 ? value[0].id : null
				},
				{
					name: "gallery",
					value: [],
					onSubmitValue: value =>
						value.length > 0
							? value
									.reduce(
										(prev, curr) => [...prev, curr.id],
										[]
									)
									.join(",")
							: null
				},
				{
					name: "countable",
					value: true,
					onSubmitValue: value => (value ? 1 : 0)
				},
				{
					name: "status",
					value: true,
					onSubmitValue: value => (value ? 1 : 0)
				},
				{
					name: "name",
					required: true
				},
				{
					name: "description",
					required: true
				},
				{
					name: "auto_calculation"
				},
				{
					name: "company_id",
					value:
						profile &&
						profile.success &&
						profile.success.company_id &&
						profile.success.company_id
				}
			]}
			params={{
				include: "translate",
				extra: { _l: lang }
			}}>
			{({ isSubmitting, values, setFieldValue }) => {
				return (
					<Spin spinning={isSubmitting}>
						<div className="title-md mb-20 mt-14">
							{t("Добавить еда")}
						</div>

						<Form {...{ values, lang, setFieldValue }} />
					</Spin>
				);
			}}
		</EntityForm.Main>
	);
};

export default Create;
