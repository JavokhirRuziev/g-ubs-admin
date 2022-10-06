import React, {useEffect, useState} from "react";

import {Board, Table} from "components";
import {Button, Modal, Pagination, Spin, Tag} from "antd";
import {useTranslation} from "react-i18next";
import EntityContainer from "modules/entity/containers";
import {useDispatch} from "react-redux";
import EntityActions from "modules/entity/actions";
import get from "lodash/get";
import {helpers} from "../../services";
import ExpenseModal from "./components/expenseModal";
import IncomeModal from "./components/incomeModal";

const ClientTransactions = ({match}) => {

    const [canUpdate, setCanUpdate] = useState(false);
    const [expenseModal, showExpenseModal] = useState(false);
    const [incomeModal, showIncomeModal] = useState(false);
    const [page, setPage] = useState(1);
    const [customer, setCustomer] = useState(null);
    const [customerCreditor, setCustomerCreditor] = useState([]);
    const {t} = useTranslation();
    const {id} = match.params;
    const dispatch = useDispatch();

    const loadCustomer = () => {
        dispatch(EntityActions.LoadDefault.request({
            url: `/customers/${id}`,
            params: {
                extra: {append: 'balance,creditor'}
            },
            cb: {
                success: data => setCustomer(data)
            }
        }));
    };

    const loadCustomerCreditor = () => {
        dispatch(EntityActions.LoadDefault.request({
            url: `/transactions/borrowed-by-category`,
            params: {
                extra: {customer_id: `${id}`}
            },
            cb: {
                success: data => setCustomerCreditor(data)
            }
        }));
    };

    useEffect(() => {
        loadCustomer();
        loadCustomerCreditor();
    }, [canUpdate]);

    const balance = get(customer, 'balance', 0);
    const creditor = get(customer, 'creditor', 0);

    return (
        <div>
            <Modal
                visible={expenseModal}
                onOk={() => showExpenseModal(true)}
                onCancel={() => showExpenseModal(false)}
                footer={null}
                centered
                width={430}
                destroyOnClose
            >
                <ExpenseModal {...{ showExpenseModal, id, setCanUpdate }} />
            </Modal>
            <Modal
                visible={incomeModal}
                onOk={() => showIncomeModal(true)}
                onCancel={() => showIncomeModal(false)}
                footer={null}
                centered
                width={430}
                destroyOnClose
            >
                <IncomeModal {...{ showIncomeModal, id, setCanUpdate }} />
            </Modal>

            <div className="d-flex justify-content-between mb-20">
                <div>
                    <div className="title-md">{t("Клиент")} - {get(customer, "name")}</div>
                    <div className="fw-500 fs-16">
                        <span className="mr-10">{t("Салдо")}: {balance >= 0 ?
                            <span style={{color: 'green'}}>{helpers.convertToReadable(balance)}</span> :
                            <span style={{color: 'red'}}>{helpers.convertToReadable(balance)}</span>}
                        </span>

                        <br/>

                        <span className="mr-10">{t("Кредиторка")}: {creditor >= 0 ?
                            <span style={{color: 'red'}}>{helpers.convertToReadable(creditor)}</span> :
                            <span style={{color: 'green'}}>{helpers.convertToReadable(creditor)}</span>}
                        </span>

                        {customerCreditor.length > 0 ? (
                            customerCreditor.map(item => {
                                return(
                                    <>
                                        <span className='ml-5'>
                                            <span>| {item.title}: </span>
                                            <span>{helpers.convertToReadable(item.sum)}</span>
                                        </span>
                                    </>
                                )
                            })
                        ) : (
                            <></>
                        )}
                    </div>
                </div>

                <div className='d-flex'>
                    <Button
                        type="primary"
                        size="large"
                        className="fs-14 fw-300 ml-30"
                        htmlType="button"
                        onClick={() => showIncomeModal(true)}
                    >Приход</Button>
                    <Button
                        type="primary"
                        size="large"
                        className="fs-14 fw-300 ml-30"
                        htmlType="button"
                        onClick={() => showExpenseModal(true)}
                    >Расход</Button>
                </div>

            </div>

            <Board>
                <EntityContainer.All
                    entity="transaction"
                    name={`customer-${id}`}
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
                                                render: (value, values) => <div className="divider-wrapper">
                                                    <Tag color={helpers.getTransactionTypeColor(value)}>
                                                        {helpers.getTransactionType(value)}
                                                        {values.for_creditor === 1 ? ' / Возврат долга' : ''}
                                                    </Tag>
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
