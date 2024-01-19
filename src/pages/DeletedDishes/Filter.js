import React, { Component } from "react";

import { Fields, GridElements } from "components";
import { Button, Tooltip } from "antd";

import qs from "qs";
import { Field, withFormik } from "formik";
import moment from "moment";
import { withRouter } from "react-router";
import { withTranslation } from "react-i18next";
import get from "lodash/get";

class Filter extends Component {
	render() {
		const { handleSubmit, setFieldValue, t, history } = this.props;
		const clearForm = () => {
			history.push({
				search: qs.stringify({}, { encode: false })
			});
		};

		return (
			<div className="filter-row pt-20 pl-15 pr-15">
				<form onSubmit={handleSubmit}>
					<GridElements.Row gutter={10} wrap>
						<GridElements.Column gutter={10} xs={110} calc>
							<GridElements.Row className="mb-10" gutter={10}>
								<GridElements.Column xs={3} gutter={10}>
									<Field
										component={Fields.AsyncSelect}
										name="waiter_id"
										placeholder={t("Агент")}
										isClearable={true}
										isSearchable={true}
										loadOptionsUrl="/user"
										className={"mb-0"}
										optionLabel={"name"}
										loadOptionsParams={search => {
											return {
												filter: {
													["role.role"]: "waiter"
												},
												extra: {
													name: search
												}
											};
										}}
									/>
								</GridElements.Column>
								<GridElements.Column xs={3} gutter={10}>
									<Field
										component={Fields.AsyncSelect}
										name="kitchener"
										placeholder={t("Инструктор")}
										isClearable={true}
										isSearchable={true}
										loadOptionsUrl="/user"
										className={"mb-0"}
										optionLabel={"name"}
										loadOptionsParams={search => {
											return {
												filter: {
													["role.role"]: "kitchener"
												},
												extra: {
													name: search
												}
											};
										}}
									/>
								</GridElements.Column>
								<GridElements.Column xs={3} gutter={10}>
									<Field
										component={Fields.AntDatePicker}
										name="start_at"
										size="large"
										placeholder={t("Дата начало")}
										style={{
											width: "100%",
											marginBottom: 0
										}}
										className={"mb-0"}
										showTime={{ format: "HH:mm" }}
										format="YYYY-MM-DD HH:mm"
										onChange={date => {
											setFieldValue("start_at", date);
										}}
									/>
								</GridElements.Column>
								<GridElements.Column xs={3} gutter={10}>
									<Field
										component={Fields.AntDatePicker}
										name="end_at"
										size="large"
										placeholder={t("Дата окончание")}
										style={{
											width: "100%",
											marginBottom: 0
										}}
										className={"mb-0"}
										showTime={{ format: "HH:mm" }}
										format="YYYY-MM-DD HH:mm"
										onChange={date => {
											setFieldValue("end_at", date);
										}}
									/>
								</GridElements.Column>
							</GridElements.Row>
							<GridElements.Row gutter={10} className="mb-0">
								<GridElements.Column xs={3} gutter={10}>
									<Field
										component={Fields.AsyncSelect}
										name="cashier"
										placeholder={t("Кассир")}
										isClearable={true}
										isSearchable={true}
										loadOptionsUrl="/user"
										className={"mb-0"}
										optionLabel={"name"}
										loadOptionsParams={search => {
											return {
												filter: {
													["role.role"]: "manager"
												},
												extra: {
													name: search
												}
											};
										}}
									/>
								</GridElements.Column>
								<GridElements.Column xs={3} gutter={10}>
									<Field
										component={Fields.AntInput}
										name="table_number"
										placeholder={t("Филтр по районам")}
										size={"large"}
										allowClear
										className={"mb-0"}
										type="number"
									/>
								</GridElements.Column>
								<GridElements.Column xs={3} gutter={10}>
									<Field
										component={Fields.AntInput}
										name="order_number"
										placeholder={t("Филтр по заказам")}
										size={"large"}
										allowClear
										className={"mb-0"}
										type="number"
									/>
								</GridElements.Column>
								<GridElements.Column xs={3} gutter={10}>
									<Field
										component={Fields.AsyncSelect}
										name="dish_id"
										placeholder={t("Продукт")}
										isClearable={true}
										isSearchable={true}
										loadOptionsUrl="/dishes"
										className={"mb-0"}
										optionLabel={value =>
											get(value, "translate.name")
										}
										loadOptionsParams={search => {
											return {
												extra: {
													include: "translate",
													search
												}
											};
										}}
									/>
								</GridElements.Column>
							</GridElements.Row>
							<GridElements.Row gutter={10}>
								<GridElements.Column xs={3} gutter={10}>
									<Field
										component={Fields.AntInput}
										name="quantity"
										placeholder={t("Количество")}
										size={"large"}
										allowClear
										className={"mb-0"}
										type="number"
									/>
								</GridElements.Column>
							</GridElements.Row>
						</GridElements.Column>
						<GridElements.Column xs={110} gutter={10} customSize>
							<Tooltip title={t("Фильтровать")}>
								<Button
									type={"primary"}
									icon="search"
									htmlType="submit"
									className={"mr-10"}
									size={"large"}
								/>
							</Tooltip>
							<Tooltip title={t("Очитстить фильтр")}>
								<Button
									type={"danger"}
									icon="close"
									size={"large"}
									htmlType="button"
									onClick={clearForm}
								/>
							</Tooltip>
						</GridElements.Column>
					</GridElements.Row>
				</form>
			</div>
		);
	}
}

Filter = withFormik({
	enableReinitialize: true,
	mapPropsToValues: ({ location }) => {
		const params = qs.parse(location.search, { ignoreQueryPrefix: true });

		return {
			start_at: params.start_at ? moment.unix(params.start_at) : "",
			end_at: params.end_at ? moment.unix(params.end_at) : "",
			waiter_id: params.waiter_id
				? {
						id: params.waiter_id.split("/")[0],
						name: params.waiter_id.split("/")[1]
				  }
				: null,
			kitchener: params.kitchener
				? {
						id: params.kitchener.split("/")[0],
						name: params.kitchener.split("/")[1]
				  }
				: null,
			cashier: params.cashier
				? {
						id: params.cashier.split("/")[0],
						name: params.cashier.split("/")[1]
				  }
				: null,
			table_number: params.table_number && params.table_number,
			order_number: params.order_number && params.order_number,
			dish_id: params.dish_id
				? {
						id: params.dish_id.split("/")[0],
						translate: { name: params.dish_id.split("/")[1] }
				  }
				: null,
			quantity: params.quantity && params.quantity
		};
	},
	handleSubmit: (values, { props: { lang, location, history } }) => {
		values = {
			...values,
			start_at: values.start_at ? moment(values.start_at).unix() : "",
			end_at: values.end_at ? moment(values.end_at).unix() : "",
			waiter_id: values.waiter_id
				? values.waiter_id.id + "/" + get(values, "waiter_id.name")
				: "",
			kitchener: values.kitchener
				? values.kitchener.id + "/" + get(values, "kitchener.name")
				: "",
			cashier: values.cashier
				? values.cashier.id + "/" + get(values, "cashier.name")
				: "",
			dish_id:
				values.dish_id &&
				values.dish_id.translate.dish_id +
					"/" +
					get(values, "dish_id.translate.name")
		};

		const query = qs.parse(location.search);

		values = Object.keys({ ...query, ...values }).reduce(
			(prev, curr) =>
				values[curr] || values[curr] === 0
					? { ...prev, [curr]: values[curr] }
					: { ...prev },
			{}
		);

		history.push({
			search: qs.stringify(values, { encode: false })
		});
	}
})(Filter);

export default withRouter(withTranslation("main")(Filter));
