import React, { useEffect, useState } from "react";
import config from "config";
import axios from "axios";
import { Button } from "antd";
import { get } from "lodash";

const Form = ({ selected, showDownload }) => {
	const [templates, setTemplates] = useState();
	const handleDownload = async value => {
		await axios
			.post(`${config.API_ROOT}/generate-contract`, {
				contract_id: get(selected, "id"),
				template_id: value
			})
			.then(res => {
				window.open(get(res, "data.url", "_blank"));
				showDownload(false);
			})
			.catch(err => console.log(err));
	};
	useEffect(() => {
		axios
			.get(`${config.API_ROOT}/templates`)
			.then(res => setTemplates(res.data.data))
			.catch(err => console.log(err));
	}, []);

	return (
		<div>
			<div className="title-md fs-16 mb-20">Скачать контракт</div>
			<div>
				{templates &&
					templates.map((e, ind) => (
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								fontWeight: 500,
								fontSize: "16px"
							}}>
							{ind + 1}
							{". "}
							{e.title}
							<Button onClick={() => handleDownload(e.id)}>
								Скачать
							</Button>
						</div>
					))}
			</div>
		</div>
	);
};

export default Form;
