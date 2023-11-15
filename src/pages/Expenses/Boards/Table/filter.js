import React, { Component } from "react";

import { Fields } from "components";
import { Button, Modal } from "antd";

import qs from "qs";
import { Field, withFormik } from "formik";
import moment from "moment";
import { withRouter } from "react-router";
import { withTranslation } from "react-i18next";
import get from "lodash/get";
import config from "config";

class Filter extends Component {
	render() {
		const {
			handleSubmit,
			setFieldValue,
			t,
			history,
			filterModal,
			showFilterModal
		} = this.props;

		const clearForm = () => {
			history.push({
				search: qs.stringify({}, { encode: false })
			});
			showFilterModal(false);
		};

		return (
			<div>
				<Modal
					visible={filterModal}
					onOk={() => showFilterModal(true)}
					onCancel={() => showFilterModal(false)}
					footer={null}
					centered
					width={430}
					title="Фильтр"
					destroyOnClose>
					<form onSubmit={handleSubmit}>
						<Field
							component={Fields.AsyncSelect}
							name="category_id"
							placeholder={t("Категория")}
							isClearable={true}
							loadOptionsUrl="/expense-categories"
							className={"mb-24"}
							loadOptionsParams={() => {
								return {
									filter: {
										type: config.EXPENSE_CATEGORY_TYPE
									}
								};
							}}
						/>

						<Field
							component={Fields.AntSelect}
							name="price_type"
							placeholder={t("Тип оплаты")}
							size={"large"}
							allowClear
							selectOptions={[
								{ value: 1, name: "Наличние" },
								{ value: 4, name: "Терминал" },
								{ value: 7, name: "Онлайн" },
								{ value: 6, name: "VIP" },
								{ value: 5, name: "Долг" }
							]}
							className={"w-100p"}
						/>

						<Field
							component={Fields.AntDatePicker}
							name="start_at"
							size="large"
							placeholder={t("Дата начало")}
							style={{ width: "100%", marginBottom: 0 }}
							showTime={{ format: "HH:mm" }}
							format="YYYY-MM-DD HH:mm"
							onChange={date => {
								setFieldValue("start_at", date);
							}}
						/>

						<Field
							component={Fields.AntDatePicker}
							name="end_at"
							size="large"
							placeholder={t("Дата окончание")}
							style={{ width: "100%", marginBottom: 0 }}
							showTime={{ format: "HH:mm" }}
							format="YYYY-MM-DD HH:mm"
							onChange={date => {
								setFieldValue("end_at", date);
							}}
						/>

						<div className="d-flex justify-content-between">
							<Button
								type="danger"
								size="large"
								className="fs-14 fw-300 mr-20"
								htmlType="button"
								onClick={clearForm}>
								{t("Очистить")}
							</Button>

							<Button
								type="primary"
								size="large"
								className="fs-14 fw-300"
								htmlType="submit">
								{t("Фильтровать")}
							</Button>
						</div>
					</form>
				</Modal>

				<Button
					type={"primary"}
					icon="filter"
					htmlType="button"
					className={"mr-10"}
					size={"large"}
					onClick={() => showFilterModal(true)}
				/>
			</div>
		);
	}
}

Filter = withFormik({
	enableReinitialize: true,
	mapPropsToValues: ({ location }) => {
		const params = qs.parse(location.search, { ignoreQueryPrefix: true });

		return {
			price_type: params.price_type
				? Number(params.price_type)
				: undefined,
			start_at:
				params.start_at && params.start_at !== "undefined"
					? moment.unix(params.start_at)
					: "",
			end_at:
				params.end_at && params.end_at !== "undefined"
					? moment.unix(params.end_at)
					: "",
			category_id: params.category_id
				? {
						id: params.category_id.split("/")[0],
						title: params.category_id.split("/")[1]
				  }
				: null
		};
	},
	handleSubmit: (
		values,
		{ props: { location, history, showFilterModal } }
	) => {
		values = {
			...values,
			start_at: values.start_at ? moment(values.start_at).unix() : "",
			end_at: values.end_at ? moment(values.end_at).unix() : "",
			category_id: values.category_id
				? values.category_id.id + "/" + get(values, "category_id.title")
				: ""
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

		showFilterModal(false);
	}
})(Filter);

export default withRouter(withTranslation("main")(Filter));
