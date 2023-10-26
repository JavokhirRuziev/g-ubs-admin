import React, { useEffect, useState } from "react";
import { Empty, Spin, notification } from "antd";
import { Avatar, Table } from "components";
import { useTranslation } from "react-i18next";
import { dateFormatter } from "../../../../services/dateFormatter";
import { thousandsDivider } from "../../../../services/thousandsDivider";
import { useDispatch } from "react-redux";
import Actions from "modules/entity/actions";
import { get } from "lodash";

const Create = ({ tabLang, showCreateModal, selected }) => {
	const [isFetched, setIsFetched] = useState(false);
	const [viewInfo, setViewInfo] = useState();
	const { t } = useTranslation("main");
	const dispatch = useDispatch();

	const getOrder = () => {
		setIsFetched(true);
		dispatch(
			Actions.LoadDefault.request({
				url: `/customer-finance-order/${selected}`,
				params: {
					extra: {
						_l: tabLang,
						include: "goods"
					}
				},
				cb: {
					success: data => {
						setIsFetched(false);
						setViewInfo(data);
					},
					error: data => {
						notification["error"]({
							message: t("Что-то пошло не так"),
							duration: 2
						});
					}
				}
			})
		);
	};

	useEffect(() => {
		getOrder();
	}, []);

	return Boolean(selected) ? (
		<div>
			<Spin spinning={isFetched}>
				{viewInfo && viewInfo.data && viewInfo.data && (
					<div
						className="dashboard-card-st"
						style={{ boxShadow: "none" }}>
						{viewInfo.data.goods &&
							viewInfo.data.goods.map(el => (
								<div
									className="dashboard-card-st__body"
									style={{ marginBottom: "20px" }}>
									<div className="dashboard-line --purple cursor-pointer">
										<span>{t("Фото")}</span>
										<div>
											<Avatar
												isRectangle
												isProduct
												image={
													viewInfo.data &&
													get(
														el,
														"dish.file.thumbnails.small.src"
													)
												}
											/>
										</div>
									</div>
									<div className="dashboard-line --purple cursor-pointer">
										<span>{t("Загаловок")}</span>
										<div>
											{viewInfo.data &&
												get(el, "dish.translate.name")}
										</div>
									</div>
									<div className="dashboard-line --purple cursor-pointer">
										<span>{t("Кол-во")}</span>
										<div>
											{viewInfo.data &&
												thousandsDivider(
													get(el, "quantity")
												)}
										</div>
									</div>
									<div className="dashboard-line --purple cursor-pointer">
										<span>{t("Цена")}</span>
										<div>
											{viewInfo.data &&
												thousandsDivider(
													get(el, "price")
												)}{" "}
											{t("сум")}
										</div>
									</div>
								</div>
							))}
					</div>
				)}
			</Spin>
		</div>
	) : (
		<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
	);
};

export default Create;
