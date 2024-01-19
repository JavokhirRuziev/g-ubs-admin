import React from "react";
import { Spin } from "antd";
import EntityForm from "modules/entity/forms";
import Form from "./Form";
import moment from "moment";

const Create = ({ tabLang, showCreateModal }) => {
	return (
		<EntityForm.Main
			method="post"
			entity="contracts"
			name={`all-${tabLang}`}
			url="/contracts"
			appendData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				showCreateModal(false);
				window.location.reload();
			}}
			params={{
				extra: { _l: tabLang }
			}}
			fields={[
				{
					name: "client_company_id",
					onSubmitValue: value => value.id
				},
				{ name: "contract_number" },
				{
					name: "contract_date",
					onSubmitValue: value => moment(value).unix()
				},
				{ name: "client_name" },
				{ name: "client_address" },
				{ name: "client_phone" },
				{ name: "mfo" },
				{ name: "bank" },
				{ name: "checking_account" },
				{ name: "tin" },
				{ name: "oked" },
				{ name: "vat_code" },
				{ name: "director_name" },
				{ name: "client_position" },
				{ name: "client_name_declination" },
				{ name: "is_active" }
			]}>
			{({ isSubmitting, values, setFieldValue }) => {
				return (
					<Spin spinning={isSubmitting}>
						<Form {...{ values, setFieldValue, tabLang }} />
					</Spin>
				);
			}}
		</EntityForm.Main>
	);
};

export default Create;
