import React, {useEffect, useState} from "react";
import {Button, Modal, Select} from "antd";
import { useDebounce } from "use-debounce";
import qs from "query-string";
import { useTranslation } from "react-i18next";

import { Board } from "components";
import { Search } from "components/SmallComponents";
import ClientsList from "./components/ClientsList";
import CreateClient from "./components/CreateClient";
import config from "../../config";
import {useDispatch} from "react-redux";
import Actions from "modules/entity/actions";
import {helpers} from "../../services";

const { Option } = Select;

const List = ({ location, history }) => {
	const [query, setQuery] = useState("");
	const [searchQuery] = useDebounce(query, 600);
	const [createModal, setCreateModal] = useState(false);
	const [filterSelect, setFilterSelect] = useState(0)
	const [debtTotal, setDebtTotal] = useState("")
	const [creditTotal, setCreditTotal] = useState("")

	const {t} = useTranslation("main");
	const dispatch = useDispatch();

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

	const loadCredit = () => {
		dispatch(Actions.LoadDefault.request({
			url: `/transactions/borrowed-by-category`,
			params: {
				extra: {
					customer_type: getPersonTypeId()
				}
			},
			cb: {
				success: data => {
					const totalDebt = data.reduce((prev,curr) => prev + (Number(curr.sum) < 0 ? Number(curr.sum*(-1)) : 0), 0)
					const totalCredit = data.reduce((prev,curr) => prev + (Number(curr.sum) > 0 ? Number(curr.sum) : 0), 0)

					setDebtTotal(totalDebt)
					setCreditTotal(totalCredit)
				},
				error: () => {},
			}
		}))
	}

	useEffect(() => {
		loadCredit()
	}, [params.type])
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
				<div className="title-md mb-10">
					<div>{getPageTitle()}</div>

					<div className='fw-500 fs-16'>
						<div className="mr-10" style={{color: 'green'}}>
							{t("Дебиторка")}: {debtTotal ? helpers.convertToReadable(debtTotal) : 0}
						</div>
						<div className="mr-10" style={{color: 'red'}}>
							{t("Кредиторка")}: {creditTotal ? helpers.convertToReadable(creditTotal) : 0}
						</div>
					</div>
				</div>
				<div className="d-flex mb-20">

					<div style={{width: '200px',minWidth: '200px'}} className='mr-20'>
						<Select className={'w-100p'} defaultValue={filterSelect} size={"large"} onChange={value => {
							setFilterSelect(value)
							setPage(1)
						}}>
							<Option value={0}>Все</Option>
							<Option value={'debt'}>Дебитор</Option>
							<Option value={'credit'}>Кредитор</Option>
						</Select>
					</div>

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
				<ClientsList {...{ searchQuery, type, filterSelect }} />
			</Board>
		</div>
	);
};

export default List;
