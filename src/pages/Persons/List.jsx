import React, { useState } from "react";
import { Button, Modal } from "antd";
import { useDebounce } from "use-debounce";
import qs from "query-string";
import { useTranslation } from "react-i18next";

import { Board } from "components";
import { Search } from "components/SmallComponents";
import ClientsList from "./components/ClientsList";
import CreateClient from "./components/CreateClient";
import config from "../../config";

const List = ({ location, history }) => {
	const [query, setQuery] = useState("");
	const [searchQuery] = useDebounce(query, 600);
	const [createModal, setCreateModal] = useState(false);
	const { t } = useTranslation();

	const params = qs.parse(location.search);

	const setPage = page => {
		const search = { ...params, page };
		history.push({
			search: qs.stringify(search)
		});
	};

	const getAddBtnText = () => {
		switch (params.type){
			case "clients":
				return 'Добавить клиент';
			case "employees":
				return 'Добавить сотрудник';
			case "counter_agents":
				return 'Добавить контрагент';
			default:
				return ""
		}
	}
	const getPageTitle = () => {
		switch (params.type){
			case "clients":
				return 'Клиенты';
			case "employees":
				return 'Сотрудники';
			case "counter_agents":
				return 'Контрагенты';
			default:
				return ""
		}
	}

	const getPersonTypeId = () => {
		switch (params.type){
			case "clients":
				return config.CUSTOMER_TYPE_CLIENT;
			case "employees":
				return config.CUSTOMER_TYPE_EMPLOYEE;
			case "counter_agents":
				return config.CUSTOMER_TYPE_COUNTER_AGENT;
			default:
				return ""
		}
	}

	const type = getPersonTypeId()
	return (
		<div>
			<Modal
				visible={createModal}
				onOk={() => setCreateModal(true)}
				onCancel={() => setCreateModal(false)}
				footer={null}
				centered
				width={500}
				destroyOnClose
			>
				<CreateClient {...{setCreateModal,type}}  />
			</Modal>

			<div className="d-flex justify-content-between">
				<div className="title-md">{getPageTitle()}</div>
				<div className="d-flex mb-20">
					<Search
						text={t("Поиск")}
						className={"br-25  pl-20"}
						onSearch={setQuery}
						value={query}
						{...{ setPage }}
					/>

					{type && (
						<Button
							type="primary"
							size="large"
							className="fs-14 fw-300 ml-30"
							htmlType="button"
							onClick={() => setCreateModal(true)}
						>{getAddBtnText()}</Button>
					)}

				</div>
			</div>

			<Board>
				<ClientsList {...{ searchQuery, type }} />
			</Board>
		</div>
	);
};

export default List;
