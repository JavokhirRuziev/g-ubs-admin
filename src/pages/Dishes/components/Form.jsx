import React from "react";

import { Fields, Panel } from "components";
import { Field } from "formik";
import { Button, Switch } from "antd";
import Ingredients from "./Ingredients";

import { useTranslation } from "react-i18next";
import get from "lodash/get";
import Recipe from "./Recipe";

const Form = ({ isUpdate, setFieldValue, values, lang, id, location }) => {
	const { t } = useTranslation("main");

	return (
		<div className="row">
			<div className="col-xl-8 col-md-12">
				<Panel className="mb-20">
					<Field
						component={Fields.AntInput}
						name="name"
						type="text"
						placeholder={t("Введите названию")}
						label={t("Названия")}
						size="large"
					/>
					<Field
						component={Fields.AntTextarea}
						name="description"
						type="text"
						rows={5}
						label={t("Описания")}
						placeholder={t("Введите описания")}
					/>
					<div className="row">
						{values.cost_price ? (
							<div className="col-lg-3 col-12">
								<Field
									component={Fields.AntInput}
									name="cost_price"
									type="number"
									label={t("Себестоимость")}
									size="large"
									disabled={true}
								/>
							</div>
						) : (
							""
						)}
						<div className="col-lg-3 col-12">
							<Field
								component={Fields.AntInput}
								name="price"
								type="number"
								placeholder={t("Введите цену")}
								label={t("Цена")}
								size="large"
							/>
						</div>
						<div className="col-lg-3 col-12">
							<Field
								component={Fields.AsyncSelect}
								name="unit_id"
								placeholder={t("Ед изм")}
								isClearable={true}
								loadOptionsUrl="/units"
								label={t("Ед изм")}
								className={"mb-24"}
								optionLabel={"title_ru"}
							/>
						</div>
						{values.countable ? (
							<div className="col-lg-3 col-12">
								<Field
									component={Fields.AntInput}
									name="quantity"
									type="text"
									placeholder={t("Введите кол-во")}
									label={t("Количество")}
									size="large"
								/>
							</div>
						) : (
							<></>
						)}
					</div>

					{isUpdate && (
						<>
							{/* <Ingredients /> */}
							<Recipe {...{ location, lang, id }} />
						</>
					)}
				</Panel>
			</div>
			<div className="col-xl-4 col-md-12">
				<Panel className="mb-20">
					<Field
						component={Fields.AsyncSelect}
						name="recommended"
						placeholder={t("Рекомендуемые")}
						isClearable={true}
						loadOptionsUrl="/dishes"
						className={"mb-24"}
						label={t("Рекомендуемый")}
						isMulti={true}
						isSearchable={true}
						optionLabel={option => get(option, `translate.name`)}
						loadOptionsParams={search => {
							return {
								include: "translate",
								filter: { status: 1 },
								extra: {
									_l: lang,
									search
								}
							};
						}}
					/>
					<Field
						component={Fields.AsyncSelect}
						name="menus"
						placeholder={t("Меню")}
						isClearable={true}
						loadOptionsUrl="/menus"
						className={"mb-24"}
						label={t("Меню")}
						isMulti={true}
						optionLabel={option => get(option, `title_${lang}`)}
					/>
					<Field
						component={Fields.AsyncSelect}
						name="kitchener_id"
						placeholder={t("Повор")}
						isClearable={true}
						loadOptionsUrl="/user"
						label={t("Повор")}
						className={"mb-24"}
						optionLabel={"name"}
						loadOptionsParams={() => {
							return {
								filter: { ["role.role"]: "kitchener" }
							};
						}}
					/>

					<Field
						component={Fields.AntInput}
						name="order"
						label={t("Порядок")}
						size="large"
						className={"mb-14"}
						type="number"
					/>

					<Field
						component={Fields.UploadImageManager}
						name="file_id"
						label={t("Фото")}
						size="large"
						className={"mb-14"}
					/>
					<Field
						component={Fields.UploadImageManager}
						name="video_id"
						label={t("Видео")}
						size="large"
						className={"mb-14"}
						isDocument={true}
					/>
					<Field
						component={Fields.UploadImageManager}
						name="gallery"
						label={t("Галерея")}
						size="large"
						className={"mb-14"}
						isMulti={true}
						limit={10}
					/>
					<div className="d-flex align-items-center mb-24">
						<Switch
							onChange={value => {
								setFieldValue("countable", value);
							}}
							checked={values.countable}
						/>
						<div className="ant-label mb-0 ml-10">
							{t("Исчисляемый")}
						</div>
					</div>
					<div className="d-flex align-items-center mb-24">
						<Switch
							onChange={value => {
								setFieldValue("status", value);
							}}
							checked={values.status}
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
						{isUpdate ? t("Сохранить") : t("Создать")}
					</Button>
				</Panel>
			</div>
		</div>
	);
};

export default Form;
