import React, { Component } from "react";

import { Fields } from "components";
import { Button, Modal } from "antd";

import qs from "qs";
import { Field, withFormik } from "formik";
import moment from "moment";
import { withRouter } from "react-router";
import { withTranslation } from "react-i18next";
import { helpers } from "../../services";
import get from "lodash/get";

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
			<div className="d-flex justify-content-end pt-20 pl-15 pr-15">
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
							name="dish_id"
							placeholder={t("Продукт")}
							isClearable={true}
							loadOptionsUrl="/dishes"
							className={"mb-24"}
							optionLabel={option =>
								get(option, `translate.name`)
							}
							loadOptionsParams={() => {
								return {
									include: "translate"
								};
							}}
						/>

						<Field
							component={Fields.AntSelect}
							name="status"
							placeholder={t("Филтр по статус")}
							size={"large"}
							allowClear
							selectOptions={helpers.orderStatus}
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

						<Field
							component={Fields.AsyncSelect}
							name="kitchener_id"
							placeholder={t("Инструктор")}
							isClearable={true}
							loadOptionsUrl="/user"
							optionLabel={"name"}
							className={"mb-24"}
							loadOptionsParams={() => {
								return {
									filter: { "role.role": "kitchener" }
								};
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
			type: params.type ? Number(params.type) : undefined,
			status: params.status ? Number(params.status) : undefined,
			start_at: params.start_at ? moment.unix(params.start_at) : "",
			end_at: params.end_at ? moment.unix(params.end_at) : "",
			dish_id: params.dish_id
				? {
						id: params.dish_id.split("/")[0],
						translate: { name: params.dish_id.split("/")[1] }
				  }
				: null,
			kitchener_id: params.kitchener_id
				? {
						id: params.kitchener_id.split("/")[0],
						name: params.kitchener_id.split("/")[1]
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
			dish_id: values.dish_id
				? values.dish_id.id +
				  "/" +
				  get(values, "dish_id.translate.name")
				: "",
			kitchener_id: values.kitchener_id
				? values.kitchener_id.id +
				  "/" +
				  get(values, "kitchener_id.name")
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
