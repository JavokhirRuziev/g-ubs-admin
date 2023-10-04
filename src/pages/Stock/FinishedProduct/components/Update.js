import React, { useEffect, useState } from "react";

import { Spin, notification } from "antd";
import Form from "./Form";
import qs from "query-string";
import axios from "axios";
import config from "config";

const Update = ({ location, match }) => {
	const [count, setCount] = useState();
	const [created, setCreated] = useState();
	const [getCreated, setGetCreated] = useState();
	const [step, setStep] = useState({
		get: true,
		post: false,
		put: false,
		calc_put: false
	});
	const [selected, setSelected] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(true);
	const query = qs.parse(location.search);
	const { lang, quantity } = query;
	const [tabLang, setTabLang] = useState(lang);
	const { id } = match.params;

	useEffect(() => {
		if (id) {
			axios
				.get(`${config.API_ROOT}/dish/${id}/get?_l=${tabLang}`)
				.then(res => {
					if (res.status === 204) {
						axios
							.get(
								`${config.API_ROOT}/${id}/finished-dish-products?_l=${tabLang}&include=translate&_f=json`
							)
							.then(ress => {
								setSelected({
									products: ress.data,
									dish: quantity
								});
								setIsSubmitting(false);
							})
							.catch(err => {
								if (
									err &&
									err.response &&
									err.response.data &&
									err.response.data.message &&
									err.response.data.message
								) {
									notification["error"]({
										message: err.response.data.message,
										duration: 10
									});
								}
								if (
									err &&
									err.response &&
									err.response.data &&
									err.response.data.errorMessage &&
									err.response.data.errorMessage
								) {
									notification["error"]({
										message: err.response.data.errorMessage,
										duration: 10
									});
								}
							});
					} else if (res.status === 200) {
						res.data.forEach(item => {
							setCount(prevCount => {
								return {
									...prevCount,
									[item.product_id]: item.count
								};
							});
						});
						const updated = res.data.map(el => ({
							id: el.product_id,
							count: el.count,
							name: el.product.translate.name
						}));
						setGetCreated(updated);
						setStep({
							...step,
							put: false,
							get: false,
							post: false,
							calc_put: true
						});
						setIsSubmitting(false);
					}
				})
				.catch(err => {
					if (
						err &&
						err.response &&
						err.response.data &&
						err.response.data.message &&
						err.response.data.message
					) {
						notification["error"]({
							message: err.response.data.message,
							duration: 10
						});
					}
					if (
						err &&
						err.response &&
						err.response.data &&
						err.response.data.errorMessage &&
						err.response.data.errorMessage
					) {
						notification["error"]({
							message: err.response.data.errorMessage,
							duration: 10
						});
					}
				});
		}
	}, [id]);

	const handleSubmit = e => {
		e.preventDefault();
		setIsSubmitting(true);
		if (step.get) {
			axios
				.get(
					`${config.API_ROOT}/dish/${id}/calculate?product_id=${
						count.id
					}&count=${count[count.id]}&_l=${tabLang}`
				)
				.then(res => {
					notification["success"]({
						message: res.data.message,
						duration: 10
					});
					res.data.data.forEach(item => {
						setCount(prevCount => {
							return {
								...prevCount,
								[item.product_id]: item.count
							};
						});
					});
					const updated = res.data.data.map(el => ({
						id: el.product_id,
						count: el.count
					}));
					setCreated(updated);
					setStep({
						...step,
						post: true,
						get: false,
						put: false,
						calc_put: false
					});
					setIsSubmitting(false);
				})
				.catch(err => {
					if (
						err &&
						err.response &&
						err.response.data &&
						err.response.data.message &&
						err.response.data.message
					) {
						notification["error"]({
							message: err.response.data.message,
							duration: 10
						});
					}
					if (
						err &&
						err.response &&
						err.response.data &&
						err.response.data.errorMessage &&
						err.response.data.errorMessage
					) {
						notification["error"]({
							message: err.response.data.errorMessage,
							duration: 10
						});
					}
					setIsSubmitting(false);
				});
		}
		if (step.post) {
			axios
				.post(`${config.API_ROOT}/dish/${id}/get`, {
					products: created,
					dish_count: quantity
				})
				.then(res => {
					notification["success"]({
						message: res.data.message,
						duration: 10
					});
					setStep({
						...step,
						post: false,
						get: false,
						calc_put: true,
						put: false
					});
					setIsSubmitting(false);
				})
				.catch(err => {
					if (
						err &&
						err.response &&
						err.response.data &&
						err.response.data.message &&
						err.response.data.message
					) {
						notification["error"]({
							message: err.response.data.message,
							duration: 10
						});
					}
					if (
						err &&
						err.response &&
						err.response.data &&
						err.response.data.errorMessage &&
						err.response.data.errorMessage
					) {
						notification["error"]({
							message: err.response.data.errorMessage,
							duration: 10
						});
					}
				});
		}
		if (step.calc_put) {
			axios
				.get(
					`${config.API_ROOT}/dish/${id}/calculate?product_id=${
						count.id
					}&count=${count[count.id]}&_l=${tabLang}`
				)
				.then(res => {
					notification["success"]({
						message: res.data.message,
						duration: 10
					});
					res.data.data.forEach(item => {
						setCount(prevCount => {
							return {
								...prevCount,
								[item.product_id]: item.count
							};
						});
					});
					const updated = res.data.data.map(el => ({
						id: el.product_id,
						count: el.count
					}));
					setCreated(updated);
					setStep({
						...step,
						post: false,
						get: false,
						put: true,
						calc_put: false
					});
					setIsSubmitting(false);
				})
				.catch(err => {
					if (
						err &&
						err.response &&
						err.response.data &&
						err.response.data.message &&
						err.response.data.message
					) {
						notification["error"]({
							message: err.response.data.message,
							duration: 10
						});
					}
					if (
						err &&
						err.response &&
						err.response.data &&
						err.response.data.errorMessage &&
						err.response.data.errorMessage
					) {
						notification["error"]({
							message: err.response.data.errorMessage,
							duration: 10
						});
					}
					setIsSubmitting(false);
				});
		}
		if (step.put) {
			const copy = created;
			const updated = copy.map(el => ({
				...el,
				id: el.id === count.id ? count.id : el.id,
				count: count[el.id]
			}));
			axios
				.put(`${config.API_ROOT}/dish/${id}/get`, {
					products: updated,
					dish_count: quantity
				})
				.then(res => {
					notification["success"]({
						message: res.data.message,
						duration: 10
					});
					setStep({
						...step,
						post: false,
						get: false,
						calc_put: true,
						put: false
					});
					window.location.reload();
					setIsSubmitting(false);
				})
				.catch(err => {
					if (
						err &&
						err.response &&
						err.response.data &&
						err.response.data.message &&
						err.response.data.message
					) {
						notification["error"]({
							message: err.response.data.message,
							duration: 10
						});
					}
					if (
						err &&
						err.response &&
						err.response.data &&
						err.response.data.errorMessage &&
						err.response.data.errorMessage
					) {
						notification["error"]({
							message: err.response.data.errorMessage,
							duration: 10
						});
					}
				});
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<Spin spinning={isSubmitting}>
					<Form
						{...{
							selected,
							tabLang,
							count,
							setCount,
							getCreated,
							step
						}}
					/>
				</Spin>
			</form>
		</div>
	);
};

export default Update;
