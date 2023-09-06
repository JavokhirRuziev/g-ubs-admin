import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Field({
	values,
	errors,
	touched,
	onChange,
	type,
	name,
	label,
	select,
	arr,
	phone
}) {
	const [isVisible, setVisible] = useState(false);
	const toggleVisible = () => setVisible(!isVisible);
	const { t } = useTranslation("main");

	return (
		<div
			className={`form-field__group ${
				values && values.length > 0 ? "form-field__focused" : ""
			}`}>
			{select ? null : (
				<label className="form-field__label">
					{phone ? "+998" : label}
				</label>
			)}
			{select ? (
				<select
					className="form-field__input"
					name={name}
					onChange={onChange}
					value={values}>
					<option value="" disabled>
						{t("Способ оплаты")}
					</option>
					{arr &&
						arr.map(item => (
							<option key={item.name} value={item.name}>
								{item.name}
							</option>
						))}
				</select>
			) : (
				<input
					className="form-field__input"
					type={
						type === "password"
							? isVisible
								? "text"
								: "password"
							: type
					}
					name={name}
					onChange={onChange}
					value={values}
				/>
			)}
			{type === "password" && (
				<div
					className="form-field__password-show"
					onClick={toggleVisible}
				/>
			)}
			{errors && touched && (
				<div className="form-field__error ant-form-explain">
					{errors}
				</div>
			)}
		</div>
	);
}
