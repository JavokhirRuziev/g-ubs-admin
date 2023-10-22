import React from "react";
import { Button, Input } from "antd";
import { useTranslation } from "react-i18next";
import { Panel } from "../../../../components";

const Form = ({ selected, count, setCount, getCreated, step }) => {
	const { t } = useTranslation("main");
	const handleChange = (e, count) => {
		setCount({ ...count, [count]: e.target.value, id: count });
	};

	return (
		<Panel>
			<div style={{ maxWidth: "500px" }}>
				<div className="title-md fs-16 mb-20">
					{step.get
						? t("calculate")
						: step.post
						? t("create")
						: step.calc_put
						? t("calculate and update")
						: step.put
						? t("update")
						: ""}
				</div>
				{getCreated && getCreated.length && getCreated.length
					? getCreated.map(item => (
							<div
								style={{
									display: "flex",
									alignItems: "center",
									columnGap: "10px",
									marginBottom: "10px"
								}}>
								<>
									<Input
										type="text"
										placeholder={t("Введите название")}
										size="large"
										value={item.name}
										readOnly
									/>
									<div>
										<Input
											className="ant-input-lg"
											type="number"
											value={
												count &&
												count[item.id] &&
												count[item.id]
											}
											onChange={e =>
												handleChange(e, item.id)
											}
											readOnly={step.create || step.put}
										/>
									</div>
								</>
							</div>
					  ))
					: selected &&
					  selected.products.data &&
					  selected.products.data.map(item => (
							<div
								style={{
									display: "flex",
									alignItems: "center",
									columnGap: "10px",
									marginBottom: "10px"
								}}>
								<>
									<Input
										type="text"
										placeholder={t("Введите название")}
										size="large"
										value={item.product.translate.name}
										readOnly
									/>
									<div>
										<Input
											className="ant-input-lg"
											type="number"
											value={
												count &&
												count[
													item.product.translate.id
												] &&
												count[item.product.translate.id]
											}
											onChange={e =>
												handleChange(
													e,
													item.product.translate.id
												)
											}
											readOnly={step.create || step.put}
										/>
									</div>
								</>
							</div>
					  ))}
				{console.log(!Boolean(step.calc_put && count && count.id))}

				<Button
					type="primary"
					size="large"
					className="fs-14 fw-300"
					htmlType="submit"
					disabled={
						!Boolean(step.get && count && count.id) &&
						!step.post &&
						!Boolean(step.calc_put && count && count.id) &&
						!step.put
					}>
					{step.get
						? t("calculate")
						: step.post
						? t("create")
						: step.calc_put
						? t("calculate")
						: step.put
						? t("update")
						: ""}
				</Button>
			</div>
		</Panel>
	);
};

export default Form;
