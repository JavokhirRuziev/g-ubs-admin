import React, { useState } from "react";
import { Button, Upload } from "antd";
import { useTranslation } from "react-i18next";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import config from "config";
import { get } from "lodash";

const Form = ({ selected, showUpdateFileModal }) => {
	const { t } = useTranslation("main");
	const [file, setFile] = useState();

	const handleChange = value => {
		const data = new FormData();
		data.append("template_id", get(value, "id"));
		data.append("file", get(value, "file"));
		axios
			.post(`${config.API_ROOT}/templates/file/update`, data)
			.then(res => window.location.reload())
			.catch(err => console.log(err));
	};

	return (
		<div>
			<div className="title-md fs-16 mb-20">{t("Изменить")}</div>

			<Upload
				action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
				listType="file"
				// defaultFileList={selected.file ? [selected.file] : []}
				name="file"
				onChange={e => setFile(e.file.originFileObj)}>
				<Button>
					<UploadOutlined />
					Yuklash
				</Button>
			</Upload>
			<div style={{ display: "flex", justifyContent: "space-between" }}>
				<div />
				<Button
					type="primary"
					size="large"
					className="fs-14 fw-300 mt-20"
					htmlType="button"
					onClick={e =>
						handleChange({
							file: file,
							id: get(selected, "id")
						})
					}>
					{t("Сохранить")}
				</Button>
			</div>
		</div>
	);
};

export default Form;
