import React from "react";

import { Spin } from "antd";
import EntityForm from "modules/entity/forms";
import Form from "./Form";
import get from "lodash/get";
import EntityContainer from "modules/entity/containers";
import moment from "moment";

const Update = ({ tabLang, selected, showUpdateModal, id }) => {
	return (
		<EntityContainer.One
			entity="contracts"
			name={get(selected, "id")}
			url={`/contracts/${get(selected, "id")}`}
			primaryKey="id"
			id={get(selected, "id")}
			params={{
				extra: { _l: tabLang }
			}}>
			{({ item, isFetched }) => {
				console.log(item);
				return (
					<Spin spinning={!isFetched}>
						<EntityForm.Main
							method="put"
							entity="contracts"
							name={`all-${tabLang}`}
							url={`/contracts/${get(item, "id")}`}
							primaryKey="id"
							normalizeData={data => data}
							id={get(selected, "id")}
							onSuccess={(data, resetForm) => {
								resetForm();
								showUpdateModal(false);
								window.location.reload();
							}}
							params={{
								extra: { _l: tabLang }
							}}
							fields={[
								{
									name: "client_company_id",
									onSubmitValue: value => value.id,
									value: get(item, "client_company")
								},
								{
									name: "contract_number",
									value: get(item, "contract_number")
								},
								{
									name: "contract_date",
									value: moment.unix(
										get(item, "contract_date")
									),
									onSubmitValue: value => moment(value).unix()
								},
								{
									name: "client_name",
									value: get(item, "client_name")
								},
								{
									name: "client_address",
									value: get(item, "client_address")
								},
								{
									name: "client_phone",
									value: get(item, "client_phone")
								},
								{
									name: "mfo",
									value: get(item, "mfo")
								},
								{
									name: "bank",
									value: get(item, "bank")
								},
								{
									name: "checking_account",
									value: get(item, "checking_account")
								},
								{
									name: "tin",
									value: get(item, "tin")
								},
								{
									name: "oked",
									value: get(item, "oked")
								},
								{
									name: "vat_code",
									value: get(item, "vat_code")
								},
								{
									name: "director_name",
									value: get(item, "director_name")
								},
								{
									name: "client_position",
									value: get(item, "client_position")
								},
								{
									name: "client_name_declination",
									value: get(item, "client_name_declination")
								},
								{
									name: "is_active",
									value: get(item, "is_active")
								}
							]}
							updateData>
							{({ isSubmitting, values, setFieldValue }) => {
								return (
									<Spin spinning={isSubmitting}>
										<Form
											{...{
												values,
												setFieldValue,
												isUpdate: true,
												tabLang,
												item
											}}
										/>
									</Spin>
								);
							}}
						</EntityForm.Main>
					</Spin>
				);
			}}
		</EntityContainer.One>
	);
};

export default Update;
