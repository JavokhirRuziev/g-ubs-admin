import React, { useEffect, useState } from "react";

import { Fields } from "components";
import { Field } from "formik";
import { Button, Switch } from "antd";
import { useTranslation } from "react-i18next";
import axios from "axios";
import config from "config";

const Form = ({
	isUpdate,
	setFieldValue,
	values,
	send_roles,
	setSend_roles
}) => {
	const [roles, setRoles] = useState();
	const [permissions, setPermissions] = useState();

	useEffect(() => {
		if (isUpdate) {
			setSend_roles(values.roles);
		}
		axios
			.get(`${config.API_ROOT}/user/roles/permissions`)
			.then(res => {
				setRoles(res.data.roles);
				setPermissions(res.data.permissions);
			})
			.catch(err => console.log(err));
	}, []);

	const { t } = useTranslation("main");
	return (
		<div>
			<div className="title-md fs-16 mb-20">
				{isUpdate
					? t("Изменение менеджера")
					: t("Добавление менеджера")}
			</div>

			<div className="fake-inputs">
				<input
					type="text"
					name={"login"}
					placeholder={t("Введите логин")}
				/>
				<input type="password" name={"password"} />
			</div>

			<Field
				component={Fields.AntInput}
				name="name"
				type="text"
				placeholder={t("Введите имя")}
				label={t("Имя")}
				size="large"
			/>
			<Field
				component={Fields.AntInput}
				name="login"
				type="text"
				placeholder={t("Введите логин")}
				label={t("Логин")}
				size="large"
			/>
			<Field
				component={Fields.AntInput}
				name="password"
				type="password"
				placeholder={t("Введите пароль")}
				label={t("Пароль")}
				size="large"
			/>

			<div className="d-flex align-items-center mb-20 mt-20">
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

			<div
				style={{
					rowGap: "5px",
					display: "flex",
					flexDirection: "column"
				}}>
				{roles &&
					roles.map(role => {
						return (
							<div key={role.title} className="mb-20">
								<div
									style={{
										display: "flex",
										marginBottom: "10px"
									}}>
									<Switch
										name="roles"
										onChange={value => {
											send_roles
												? setSend_roles(prevRoles => {
														if (value) {
															return [
																...prevRoles,
																{
																	role:
																		role.value
																}
															];
														} else {
															return prevRoles.filter(
																r =>
																	r.role !==
																	role.value
															);
														}
												  })
												: setSend_roles([
														{
															role: role.value,
															permissions: null
														}
												  ]);
										}}
										checked={
											send_roles &&
											send_roles.some(
												r => r.role === role.value
											)
										}
									/>
									<div className="ant-label mb-0">
										{t(role.title)}
									</div>
								</div>
								<div
									style={{
										display: "flex",
										columnGap: "5px",
										flexWrap: "wrap",
										rowGap: "5px"
									}}>
									{permissions &&
										permissions.map(permission => {
											return (
												<div
													key={permission}
													style={{
														display: "flex",
														columnGap: "5px"
													}}>
													<Switch
														name="roles"
														disabled={
															send_roles
																? !send_roles.some(
																		r =>
																			r.role ===
																			role.value
																  )
																: true
														}
														onChange={value => {
															setSend_roles(
																prevRoles => {
																	if (value) {
																		return prevRoles.map(
																			r =>
																				r.role ===
																				role.value
																					? r &&
																					  r.permissions &&
																					  r
																							.permissions
																							.length
																						? {
																								...r,
																								permissions: [
																									...r.permissions,
																									permission
																								]
																						  }
																						: {
																								...r,
																								permissions: [
																									permission
																								]
																						  }
																					: r
																		);
																	} else {
																		return prevRoles.map(
																			r =>
																				r.role ===
																				role.value
																					? {
																							...r,
																							permissions: r.permissions.filter(
																								p =>
																									p !==
																									permission
																							)
																					  }
																					: r
																		);
																	}
																}
															);
														}}
														checked={
															send_roles &&
															send_roles.some(
																r => {
																	if (
																		r.value ||
																		r.permissions
																	) {
																		return (
																			r.role ===
																				role.value &&
																			r.permissions.includes(
																				permission
																			)
																		);
																	}
																}
															)
														}
													/>
													<div className="ant-label mb-0">
														{t(permission)}
													</div>
												</div>
											);
										})}
								</div>
							</div>
						);
					})}
			</div>

			<Button
				type="primary"
				size="large"
				className="fs-14 fw-300"
				htmlType="submit">
				{isUpdate ? t("Сохранить") : t("Добавить")}
			</Button>
		</div>
	);
};

export default Form;
