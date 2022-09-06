import React, { useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import axios from "axios";

import { DatePicker, Spin } from "antd";
import config from "config";
import { Field } from "formik";
import { Fields } from "components";
import EntityForm from "modules/entity/forms";
import { storage } from "services";

const ReportModal = ({ openReportModal }) => {
	const { RangePicker } = DatePicker;
	const [startDate, setStartDate] = useState(moment().unix());
	const [endDate, setEndDate] = useState(moment().unix());

	const profile = useSelector(state => state.auth.data);
	const storageToken = storage.get("token");

	const { t } = useTranslation();

	const downloadFile = (url, start, end, key, value) => {
		let params = {
			start: start,
			end: end,
			[key]: value
		};

		if (!value || !key) {
			delete params[key];
		}

		axios.get(`${config.API_ROOT}/reports/report/${url}`, {
			headers: {
				"Authorization": `Bearer ${get(profile, "token.token", storageToken)}`
			},
			params: params,
			responseType: "blob"
		}).then(res => {
			const blob = new Blob([res.data]);
			const url = URL.createObjectURL(blob);
			const link = Object.assign(
				document.createElement("a"), {
					href: url,
					download: "Report.xlsx",
					target: "_blank"
				}
			);

			document.body.appendChild(link);
			link.click();

			document.body.removeChild(link);
			URL.revokeObjectURL(url);
			openReportModal(false);
		});
	};


	return (
		<EntityForm.Default
			method="post"
			url={`/erp/report`}
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
			}}
			fields={[
				{
					name: "client"
				}
			]}
		>
			{({ isSubmitting, values }) => {
				return (
					<Spin spinning={isSubmitting}>
						<div className="title-md fs-16 mb-20">{t("Сформировать отчеть")}</div>

						<RangePicker
							size={"large"}
							className={"mb-20"}
							value={startDate ? [moment.unix(startDate), moment.unix(endDate)] : []}
							onChange={(date) => {
								if (date.length > 0) {
									let startValue = moment(date[0]).unix();
									let endValue = moment(date[1]).unix();
									setStartDate(startValue);
									setEndDate(endValue);
								} else {
									setStartDate(null);
									setEndDate(null);
								}
							}}
						/>

						<Field
							component={Fields.AsyncSelect}
							name="client"
							placeholder={t("Выберите клиента")}
							isClearable
							loadOptionsUrl="/crm/customers"
							className="mb-20"
							optionLabel="name"
							isSearchable
							loadOptionsParams={search => {
								return {
									extra: { name: search }
								};
							}}
						/>

						<table className="bordered">
							<thead>
							<tr>
								<th>{t("Названия")}</th>
								<th></th>
							</tr>
							</thead>
							<tbody>
							{get(values, "client.id") ? (
								<tr>
									<td>
										{t("Отчет")}
									</td>
									<td>
										<div className="as-link"
											 onClick={() => downloadFile(`customer/${get(values, "client.id")}`, startDate, endDate)}>
											{t("Сформировать")}
										</div>
									</td>
								</tr>
							) : (
								<tr>
									<td>
										{t("Отчет")}
									</td>
									<td>
										<div className="as-link" onClick={() => downloadFile("customer-balance", startDate, endDate)}>
											{t("Сформировать")}
										</div>
									</td>
								</tr>
							)}
							</tbody>
						</table>
					</Spin>
				);
			}}
		</EntityForm.Default>
	);
};

export default ReportModal;
