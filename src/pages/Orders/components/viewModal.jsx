import React from "react";
import get from "lodash/get";
import { Tag } from "antd";
import { helpers } from "services";
import { Avatar } from "../../../components";

const ViewModal = ({ selected }) => {
	const order_number = get(selected, "order_number");
	const type = get(selected, "type");
	const phone = get(selected, "user.phone");
	const name = get(selected, "user.name");
	const completed = get(selected, "completed") === 1;
	const table_number = get(selected, "booking.table.number");
	const comment = get(selected, "comment");
	const rejectReason = get(selected, "reason.comment");
	const payments = get(selected, "payments");

	const latitude = get(selected, "address.latitude");
	const longitude = get(selected, "address.longitude");
	const address = get(selected, "address.address");

	const goods = get(selected, "goods", []);
	const total_sum = get(selected, "total_sum");
	const products_sum = get(selected, "total_price");
	const delivery_price = get(selected, "delivery_price");
	const isRejected = get(selected, "status") === 30;
	const isCompleted = get(selected, "status") === 20;
	console.log(selected);

	return (
		<div>
			<div className="fs-20 fw-500 mb-30">Заказ - {order_number}</div>

			{comment && (
				<div className="info-col mb-24">
					<div className="info-col__label">Особые пожелания:</div>
					<div className="info-col__value">
						<Tag color={"orange"} className="w-100p text-left">
							{comment}
						</Tag>
					</div>
				</div>
			)}

			<div className="row">
				{isRejected && (
					<div className="col-12 info-col mb-20">
						<div className="info-col__label">
							Причина отклонение:
						</div>
						<div className="info-col__value">
							<Tag color={"red"} className="w-100p text-left">
								{rejectReason
									? rejectReason
									: "нет комментарии"}
							</Tag>
						</div>
					</div>
				)}

				<div className="col-4 info-col mb-20">
					<div className="info-col__label">Номер клиента:</div>
					<div className="info-col__value">{phone ? phone : "-"}</div>
				</div>
				<div className="col-4 info-col mb-20">
					<div className="info-col__label">Имя клиента:</div>
					<div className="info-col__value">{name ? name : "-"}</div>
				</div>
				<div className="col-4 info-col mb-20">
					<div className="info-col__label">Тип заказа:</div>
					<div className="info-col__value">
						{helpers.getOrderType(type)}
					</div>
				</div>
				<div className="col-4 info-col mb-20">
					<div className="info-col__label">Номер стола:</div>
					<div className="info-col__value">
						{table_number ? table_number : "-"}
					</div>
				</div>

				{isCompleted && completed && (
					<div className="col-4 info-col mb-20">
						<div className="info-col__label">Тип оплата:</div>
						{payments.map(payment => (
							<div className="info-col__value">
								<div className="row mb-10">
									<div className="col-6">
										{helpers.getPaymentType(
											payment.payment_type
										)}
										:
									</div>
									<div className="col-6">
										{payment.amount.toLocaleString()}
									</div>
								</div>
							</div>
						))}
					</div>
				)}

				{address && (
					<div className="col-12">
						<div className="info-col address-block">
							<div className="info-col__label">Адрес:</div>
							<div className="info-col__value">
								<a
									href={`https://yandex.ru/maps/?pt=${longitude},${latitude}&z=17&l=map`}
									target={"_blank"}>
									{address}
								</a>
							</div>
						</div>
					</div>
				)}
			</div>

			<div className="order-goods">
				<div className="info-col__label mb-10">Продукты:</div>
				<table className="bordered">
					<thead>
						<tr>
							<th>Фото</th>
							<th>Названия</th>
							<th>Кол-во</th>
							<th>Цена за единицу</th>
							<th>Цена</th>
						</tr>
					</thead>
					<tbody>
						{goods.map(item => {
							const a =
								get(item, "price", 1) *
								get(item, "quantity", 1);
							const quantity = get(item, "quantity");

							return (
								<tr key={item.id}>
									<td style={{ width: "72px" }}>
										<Avatar
											isProduct
											isRectangle
											size={"sm"}
											image={get(
												item,
												"dish.file.thumbnails.small.src"
											)}
											bigImage={get(
												item,
												"dish.file.thumbnails.low.src"
											)}
										/>
									</td>
									<td>{get(item, "dish.translate.name")}</td>
									<td>
										{quantity
											? helpers.convertToReadable(
													quantity
											  )
											: ""}
									</td>
									<td>
										{helpers.convertToReadable(
											get(item, "price")
										)}
									</td>
									<td>
										{a ? helpers.convertToReadable(a) : 0}
									</td>
								</tr>
							);
						})}
						<tr>
							<td colSpan={"4"}>Сумма продуктов:</td>
							<td>
								{products_sum
									? helpers.convertToReadable(products_sum)
									: "-"}
							</td>
						</tr>
						<tr>
							<td colSpan={"4"}>Сумма доставки:</td>
							<td>
								{delivery_price
									? helpers.convertToReadable(delivery_price)
									: 0}
							</td>
						</tr>
						<tr>
							<td colSpan={"4"}>Общий:</td>
							<td>
								{total_sum
									? helpers.convertToReadable(total_sum)
									: "-"}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ViewModal;
