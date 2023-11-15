import React from "react";
import { Field, Formik } from "formik";
import { Fields } from "components";
import { get } from "lodash";

export default function Filters({ search, setSearch, t, tabLang }) {
	return (
		<div
			style={{
				display: "flex",
				columnGap: "10px",
				rowGap: "10px",
				flexWrap: "wrap",
				width: "80%"
			}}>
			<Formik>
				{({ setFieldValue }) => (
					<>
						<div style={{ width: "195px" }}>
							<Field
								component={Fields.AsyncSelect}
								name="dishes"
								placeholder={t("Еды")}
								isClearable
								loadOptionsUrl={`/finished-dishes`}
								optionValue="id"
								optionLabel={option =>
									get(option, `translate.name`)
								}
								style={{
									marginBottom: "0px"
								}}
								onChange={value => {
									setFieldValue(
										"dishes",
										get(value, "translate.name")
									);
									setSearch({
										...search,
										dish: get(value, "translate.dish_id")
									});
								}}
								loadOptionsParams={search => {
									return {
										include: "translate",
										extra: {
											_l: tabLang
										},
										search
									};
								}}
							/>
						</div>
						<div style={{ width: "195px" }}>
							<Field
								component={Fields.AsyncSelect}
								name="kitchener"
								placeholder={t("Повор")}
								isClearable
								loadOptionsUrl="/user"
								optionValue="id"
								optionLabel={option => get(option, `name`)}
								style={{
									marginBottom: "0px"
								}}
								onChange={value => {
									setFieldValue(
										"kitchener",
										get(value, "name")
									);
									setSearch({
										...search,
										kitchener: get(value, "id")
									});
									console.log(value);
								}}
								loadOptionsParams={search => {
									return {
										filter: { ["role.role"]: "kitchener" },
										search
									};
								}}
							/>
						</div>
						<div>
							<Field
								component={Fields.AntDatePicker}
								name="start_at"
								size="large"
								placeholder={t("Дата начало")}
								style={{ marginBottom: "0px", width: "190px" }}
								className={"mb-0"}
								showTime={{ format: "HH:mm" }}
								format="YYYY-MM-DD HH:mm"
								onChange={e => {
									setSearch({
										...search,
										start_date: e
									});
									setFieldValue("start_at", e);
								}}
							/>
						</div>
						<div>
							<Field
								component={Fields.AntDatePicker}
								name="end_at"
								size="large"
								placeholder={t("Дата окончание")}
								style={{ marginBottom: "0px", width: "190px" }}
								className={"mb-0"}
								showTime={{ format: "HH:mm" }}
								format="YYYY-MM-DD HH:mm"
								onChange={e => {
									setSearch({
										...search,
										end_date: e
									});
									setFieldValue("end_at", e);
								}}
							/>
						</div>
					</>
				)}
			</Formik>
		</div>
	);
}
