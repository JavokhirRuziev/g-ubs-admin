import React, { useEffect, useState } from "react";

import { Fields } from "components";
import { Field } from "formik";
import { Button } from "antd";
import { useTranslation } from "react-i18next";

import axios from "axios";
import config from "config";
import get from "lodash/get";
import { Avatar } from "../../../../components";
import { ReactComponent as DeleteIcon } from "./icons/delete.svg";

const FormUpdate = ({ tabLang, setFieldValue }) => {
	const [save, setSave] = useState(false);
	const { t } = useTranslation("main");
	const [finishedDishes, setFinishedDishes] = useState();
	const [dishes, setDishes] = useState();

	useEffect(() => {
		axios
			.get(
				`${config.API_ROOT}/recalculation-finished-dishes-daily?_l=${tabLang}&include=finished_dish`
			)
			.then(res => {
				setFinishedDishes(res.data);
				const filteredData = res.data.map(el => ({
					dish_id: el.finished_dish.id,
					count: el.finished_dish.quantity
				}));
				setDishes(filteredData);
			})
			.catch(err => console.log(err));
	}, []);

	return (
		<div>
			<div className="title-md fs-16 mb-20">{t("Изменить")}</div>
			{finishedDishes &&
				finishedDishes.map(dish => (
					<div
						style={{
							display: "flex",
							alignItems: "center",
							columnGap: "10px"
						}}>
						<div className="divider-wrapper">
							<Avatar
								isRectangle
								isProduct
								image={get(
									dish,
									"finished_dish.file.thumbnails.small.src"
								)}
							/>
						</div>
						<Field
							component={Fields.AntInput}
							name="name"
							type="text"
							placeholder={t("Количество")}
							label={t(get(dish, "finished_dish.translate.name"))}
							size="medium"
							disabled
							value={get(dish, "finished_dish.quantity")}
						/>
						<Field
							component={Fields.AntInput}
							name="name"
							type="text"
							size="medium"
							label={t("Изменить")}
							value={
								dishes &&
								dishes.find(
									el =>
										el.dish_id ===
										get(dish, "finished_dish.id")
								).count
							}
							onChange={e => {
								const updatedArr = dishes.map(dishItem => {
									if (
										dishItem.dish_id ===
										dish.finished_dish.id
									) {
										return {
											...dishItem,
											count: e.target.value
										};
									} else {
										return dishItem;
									}
								});
								setDishes(updatedArr);
							}}
						/>
						<div
							className="action-btn delete-btn cursor-pointer"
							onClick={() => {
								const filteredArr = finishedDishes.filter(
									el =>
										el.finished_dish.id !==
										get(dish, "finished_dish.id")
								);
								const sendFilteredArr = filteredArr.map(el => ({
									dish_id: el.finished_dish.id,
									count: el.finished_dish.quantity
								}));
								setDishes(sendFilteredArr);
								setFinishedDishes(filteredArr);
							}}>
							<DeleteIcon height={16} width={16} />
						</div>
					</div>
				))}

			<div style={{ display: "flex", justifyContent: "flex-end" }}>
				{save ? (
					<Button
						type="primary"
						size="large"
						className="fs-14 fw-300"
						htmlType="submit">
						{t("Подтвердить?")}
					</Button>
				) : (
					<Button
						type="primary"
						size="large"
						className="fs-14 fw-300"
						onClick={() => {
							setSave(true);
							setFieldValue("dishes", dishes);
						}}>
						{t("Сохранить?")}
					</Button>
				)}
			</div>
		</div>
	);
};

export default FormUpdate;
