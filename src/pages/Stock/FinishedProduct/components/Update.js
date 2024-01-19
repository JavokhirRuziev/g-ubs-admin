import React, { useEffect, useState } from "react";

import { Spin, notification } from "antd";
import Form from "./Form";
import qs from "query-string";
import axios from "axios";
import config from "config";
import Actions from "modules/entity/actions";
import { useDispatch } from "react-redux";

const Update = ({ location, match }) => {
	const dispatch = useDispatch();
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
	const [dish_count, setDish_count] = useState();

	const notifyError = err => {
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
	};
	const loadFieldsValue = () => {
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
							notifyError(err);
							setIsSubmitting(false);
						});
				}
				if (res.status === 200) {
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
				notifyError(err);
				setIsSubmitting(false);
			});
	};
	const loadStepGet = () => {
		dispatch(
			Actions.LoadDefault.request({
				url: `/dish/${id}/calculate`,
				params: {
					extra: {
						_l: tabLang,
						product_id: count.id,
						count: count[count.id]
					}
				},
				cb: {
					success: res => {
						notification["success"]({
							message: res.message,
							duration: 10
						});
						setDish_count(res.dish_count);
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
					},
					error: err => {
						notifyError(err);
						setIsSubmitting(false);
					}
				}
			})
		);
	};
	const loadStepPost = () => {
		dispatch(
			Actions.Form.request({
				method: "post",
				entity: `/dish/${id}/get`,
				name: `all`,
				url: `/dish/${id}/get`,
				params: {
					extra: {
						_l: tabLang,
						product_id: count.id,
						count: count[count.id]
					}
				},
				values: {
					products: created,
					dish_count: dish_count
				},
				normalizeData: data => data,
				prependData: true,
				cb: {
					success: res => {
						notification["success"]({
							message: res.message,
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
						window.location.reload();
					},
					error: err => {
						notifyError(err);
						setIsSubmitting(false);
					}
				}
			})
		);
	};
	const loadStepCalcPut = () => {
		dispatch(
			Actions.LoadDefault.request({
				url: `/dish/${id}/calculate`,
				params: {
					extra: {
						_l: tabLang,
						product_id: count.id,
						count: count[count.id]
					}
				},
				cb: {
					success: res => {
						notification["success"]({
							message: res.message,
							duration: 10
						});
						setDish_count(res.dish_count);
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
					},
					error: err => {
						notifyError(err);
						setIsSubmitting(false);
					}
				}
			})
		);
	};
	const loadStepPut = () => {
		const copy = created;
		const updated = copy.map(el => ({
			...el,
			id: el.id === count.id ? count.id : el.id,
			count: count[el.id]
		}));
		dispatch(
			Actions.Form.request({
				method: "put",
				entity: `/dish/${id}/get`,
				name: `all`,
				url: `/dish/${id}/get`,
				params: {
					extra: {
						_l: tabLang,
						product_id: count.id,
						count: count[count.id]
					}
				},
				values: {
					products: updated,
					dish_count: dish_count
				},
				normalizeData: data => data,
				prependData: true,
				cb: {
					success: res => {
						notification["success"]({
							message: res.message,
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
					},
					error: err => {
						notifyError(err);
						setIsSubmitting(false);
					}
				}
			})
		);
	};

	useEffect(() => {
		if (id) {
			loadFieldsValue();
		}
	}, [id]);

	const handleSubmit = e => {
		e.preventDefault();
		setIsSubmitting(true);
		if (step.get) {
			loadStepGet();
		}
		if (step.post) {
			loadStepPost();
		}
		if (step.calc_put) {
			loadStepCalcPut();
		}
		if (step.put) {
			loadStepPut();
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
