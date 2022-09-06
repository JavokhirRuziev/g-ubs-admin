import React, { useState } from "react";
import { Button, Modal } from "antd";
import { useDebounce } from "use-debounce";
import qs from "query-string";
import { useTranslation } from "react-i18next";

import { Board } from "components";
import { Search } from "components/SmallComponents";
import PartnersList from "./components/ClientsList";
import CreateClient from "./components/CreateClient";

const List = ({ location, history }) => {
	const [query, setQuery] = useState("");
	const [searchQuery] = useDebounce(query, 600);
	const [createModal, setCreateModal] = useState(false);
	const { t } = useTranslation();

	const setPage = page => {
		const query = qs.parse(location.search);
		const search = { ...query, page };
		history.push({
			search: qs.stringify(search)
		});
	};

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
				<CreateClient {...{setCreateModal}}  />
			</Modal>

			<div className="d-flex justify-content-between">
				<div className="title-md">{t("Клиенты")}</div>
				<div className="d-flex mb-20">
					<Search
						text={t("Поиск")}
						className={"br-25  pl-20"}
						onSearch={setQuery}
						value={query}
						{...{ setPage }}
					/>

					<Button
						type="primary"
						size="large"
						className="fs-14 fw-300 ml-30"
						htmlType="button"
						onClick={() => setCreateModal(true)}
					>{t("Добавить контрагент")}
					</Button>
				</div>
			</div>

			<Board>
				<PartnersList {...{ searchQuery }} />
			</Board>
		</div>
	);
};

export default List;
