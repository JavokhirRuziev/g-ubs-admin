import React, {useEffect, useState} from "react";

import {Board, Table} from "components";
import {Pagination, Spin, Tag} from "antd";
import {useTranslation} from "react-i18next";
import EntityContainer from "modules/entity/containers";
import {helpers, time, utils} from "services";
import {useDispatch, useSelector} from "react-redux";
import EntityActions from "modules/entity/actions";
import get from "lodash/get";
import {Link} from "react-router-dom";

const ClientTransactions = ({match}) => {

    const rates = useSelector(state => state.system.rates);
    const [page, setPage] = useState(1);
    const [customer, setCustomer] = useState(null);
    const {t} = useTranslation();
    const {id} = match.params;
    const dispatch = useDispatch();
    const uy = get(rates, 'data[0].price')

    const loadCustomer = () => {
        dispatch(EntityActions.LoadDefault.request({
            url: `/crm/customers/${id}`,
            params: {
                include: "balance"
            },
            cb: {
                success: data => setCustomer(data)
            }
        }));
    };

    useEffect(() => {
        loadCustomer();
    }, []);

    return (
        <div>
            <div className="d-flex justify-content-between mb-20">
                <div className="title-md">{t("Клиент")} - {get(customer, "name")}</div>
                <div className="fw-500 fs-16">
                    <span className="mr-10">{t("Салдо")}:</span>
                    <span className="mr-5">
						{get(customer, "balance") ? (
                            <span className={customer.balance >= 0 ? "--green" : "--red"}>{customer.balance.toLocaleString()} ({(customer.balance/uy).toFixed(2).toLocaleString()})</span>
                        ) : <span className="--green">0</span>}</span>/
                    <span className="ml-5">
						{get(customer, "balance_uy") ? (
                            <span className={customer.balance_uy >= 0 ? "--green" : "--red"}>{customer.balance_uy.toLocaleString()}</span>
                        ) : <span className="--green">0</span>}
					</span>
                </div>
            </div>

            <Board>
                <EntityContainer.All
                    entity="transactions"
                    name={`transactions-${id}`}
                    url="/crm/account-balance/transactions"
                    primaryKey="id"
                    params={{
                        sort: "-id",
                        limit: 50,
                        filter: {
                            customer_id: id
                        },
                        include: "author.employees,balance,customerCategories,invoices.contracts.order.author.employees",
                        page
                    }}
                >
                    {({items, isFetched, meta}) => {
                        return (
                            <Spin spinning={!isFetched}>
                                <div className="default-table pad-15">
                                    <Table
                                        rowKey={"id"}
                                        columns={[
                                            {
                                                title: t("Номер договора"),
                                                dataIndex: "invoices.contracts.order_id",
                                                className: "w-150 text-cen",
                                                render: value => <div className="divider-wrapper">
                                                    <Link to={`/orders/view/${value}`}>{value ? value : " "}</Link>
                                                </div>
                                            },
                                            {
                                                title: t("Номер счет-фактуры"),
                                                dataIndex: "id",
                                                className: "w-150 text-cen",
                                                render: value => <div className="divider-wrapper">{value}</div>
                                            },
                                            {
                                                title: t("Продавец"),
                                                dataIndex: "invoices",
                                                render: value => <div className="divider-wrapper">
                                                    <span>{get(value, "contracts.order.author.employees.name")}</span>
                                                    <span>{get(value, "contracts.order.author.employees.last_name")}</span>
                                                </div>
                                            },
                                            {
                                                title: t("Кассир"),
                                                dataIndex: "author",
                                                render: value => <div className="divider-wrapper">
                                                    {value ? (
                                                        <div>
                                                            <span>{get(value, "employees.name")}</span>
                                                            <span>{get(value, "employees.last_name")}</span>
                                                        </div>
                                                    ) : "-"}
                                                </div>
                                            },
                                            {
                                                title: t("Дата создание"),
                                                dataIndex: "created_at",
                                                className: "text-cen",
                                                render: value => <div
                                                    className="divider-wrapper">{time.to(value, "DD.MM.YYYY HH:mm")}</div>
                                            },
                                            {
                                                title: t("Дата изменение"),
                                                dataIndex: "updated_at",
                                                className: "text-cen",
                                                render: value => <div
                                                    className="divider-wrapper">{time.to(value, "DD.MM.YYYY HH:mm")}</div>
                                            },
                                            {
                                                title: t("Тип"),
                                                dataIndex: "is_income",
                                                className: "text-cen",
                                                render: value => <div className="divider-wrapper">
                                                    {value === 1 ? <Tag color={"green"}>{t("Приход")}</Tag> :
                                                        <Tag color={"red"}>{t("Расход")}</Tag>}
                                                </div>
                                            },
                                            {
                                                title: t("Сумма"),
                                                dataIndex: "sum",
                                                className: "",
                                                render: (value, row) => <div className="divider-wrapper">
                                                    {get(row, 'type') === 4 ? (
                                                        <div>
                                                            {get(row, 'sum_uy') ? utils.formatNumber(get(row, "sum_uy")) : 0}
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            {get(row, 'sum', 0) ? (
                                                                <div className="d-flex">
                                                                    <span>{get(row, 'sum', 0).toLocaleString()}</span> /
                                                                    <span>({(get(row, 'sum') / get(row, 'uy')).toFixed(2)})</span>
                                                                </div>
                                                            ) : (
                                                                <div>0</div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            },
                                            {
                                                title: t("Тип суммы"),
                                                dataIndex: "type",
                                                className: "",
                                                render: (value, row) => <div className="divider-wrapper">
                                                    {helpers.getPaymentType(row.type)}
                                                </div>
                                            },
                                            {
                                                title: t("Комментария"),
                                                dataIndex: "comment",
                                                className: "text-cen",
                                                render: value => <div className="divider-wrapper">
                                                    {value ? value :
                                                        <span className="opacity-5">{t("нет комментов")}</span>}
                                                </div>
                                            }
                                        ]}
                                        dataSource={items}
                                    />
                                </div>
                                {meta && meta.perPage && (
                                    <div className="pad-15 d-flex justify-content-end">
                                        <Pagination
                                            current={meta.currentPage}
                                            pageSize={meta.perPage}
                                            total={meta.totalCount}
                                            onChange={page => setPage(page + 1)}
                                        />
                                    </div>
                                )}
                            </Spin>
                        );
                    }}
                </EntityContainer.All>
            </Board>
        </div>
    );
};

export default ClientTransactions;
