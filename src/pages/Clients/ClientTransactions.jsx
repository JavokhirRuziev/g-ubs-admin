import React, {useEffect, useState} from "react";

import {Board, Table} from "components";
import {Pagination, Spin, Tag} from "antd";
import {useTranslation} from "react-i18next";
import EntityContainer from "modules/entity/containers";
import {useDispatch} from "react-redux";
import EntityActions from "modules/entity/actions";
import get from "lodash/get";
import {helpers} from "../../services";

const ClientTransactions = ({match}) => {

    const [page, setPage] = useState(1);
    const [customer, setCustomer] = useState(null);
    const {t} = useTranslation();
    const {id} = match.params;
    const dispatch = useDispatch();

    const loadCustomer = () => {
        dispatch(EntityActions.LoadDefault.request({
            url: `/customers/${id}`,
            params: {
                extra: {append: 'balance'}
            },
            cb: {
                success: data => setCustomer(data)
            }
        }));
    };

    useEffect(() => {
        loadCustomer();
    }, []);

    const balance = get(customer, 'balance', 0);

    return (
        <div>
            <div className="d-flex justify-content-between mb-20">
                <div className="title-md">{t("Клиент")} - {get(customer, "surname") + " " + get(customer, "name")}</div>
                <div className="fw-500 fs-16">
                    <span className="mr-10">{t("Салдо")}: {balance >= 0 ?
                        <span style={{color: 'green'}}>{helpers.convertToReadable(balance)}</span> :
                        <span style={{color: 'red'}}>{helpers.convertToReadable(balance)}</span>}</span>
                </div>
            </div>

            <Board>
                <EntityContainer.All
                    entity="transactions"
                    name={`all-${id}`}
                    url="/transactions"
                    primaryKey="id"
                    params={{
                        sort: "-id",
                        limit: 50,
                        filter: {
                            customer_id: id
                        },
                        include: "category",
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
                                                title: t("ID"),
                                                dataIndex: "id",
                                                className: "w-50 text-cen",
                                                render: value => <div className="divider-wrapper">{value}</div>
                                            },
                                            {
                                                title: t("Дата"),
                                                dataIndex: "added_at",
                                                className: "text-cen",
                                                render: value => <div className="divider-wrapper">
                                                    {value ? helpers.formatDate(value, 'DD.MM.YYYY / HH:mm') : t("не указан")}
                                                </div>
                                            },
                                            {
                                                title: t("Категория"),
                                                dataIndex: "category",
                                                className: "text-cen",
                                                render: value => <div
                                                    className="divider-wrapper">{value ? value.title : "-"}</div>
                                            },
                                            {
                                                title: t("Сумма"),
                                                dataIndex: "value",
                                                className: "text-cen",
                                                render: value => <div className="divider-wrapper">
                                                    {value ? helpers.convertToReadable(value) : ""}
                                                </div>
                                            },
                                            {
                                                title: t("Тип суммы"),
                                                dataIndex: "price_type",
                                                className: "text-cen",
                                                render: value => <div className="divider-wrapper">
                                                    {helpers.getPaymentTypeExpenses(value)}
                                                </div>
                                            },
                                            {
                                                title: t("Тип"),
                                                dataIndex: "type",
                                                className: "text-cen",
                                                render: value => <div className="divider-wrapper">
                                                    {value === 2 ? <Tag color={"green"}>{t("Приход")}</Tag> :
                                                        <Tag color={"red"}>{t("Расход")}</Tag>}
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
