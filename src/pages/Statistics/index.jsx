import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import Actions from "modules/entity/actions"
import {helpers} from "../../services";
import Filter from "./Filter";
import {Board} from "../../components";
import qs from "query-string";

const Statistics = ({location}) => {
    const params = qs.parse(location.search, {ignoreQueryPrefix: true});
    const {t} = useTranslation();

    const [expensesTransactions, setExpensesTransactions] = useState([]);
    const [totalExpenses, setTotalExpenses] = useState(0);

    const [incomesTransactions, setIncomesTransactions] = useState([]);
    const [totalIncomes, setTotalIncomes] = useState(0);

    const [incomesSalesTransactions, setIncomesSalesTransactions] = useState([]);
    const dispatch = useDispatch();

    const loadExpensesByCategory = () => {
        dispatch(Actions.LoadDefault.request({
            url: `/transactions/expenses-by-category`,
            params: {
                extra: {
                    start_date: params.start_at && params.start_at,
                    end_date: params.end_at && params.end_at,
                }
            },
            cb: {
                success: data => {
                    setExpensesTransactions(data)
                    const total = data.reduce((prev,curr) => prev+Number(curr.sum), 0)
                    setTotalExpenses(total)
                },
                error: data => {}
            }
        }))
    }
    const loadIncomesByCategory = () => {
        dispatch(Actions.LoadDefault.request({
            url: `/transactions/incomes-by-category`,
            params: {
                extra: {
                    start_date: params.start_at && params.start_at,
                    end_date: params.end_at && params.end_at,
                }
            },
            cb: {
                success: data => {
                    setIncomesTransactions(data)
                    const total = data.reduce((prev,curr) => prev+Number(curr.sum), 0)
                    setTotalIncomes(total)
                },
                error: data => {}
            }
        }))
    }
    const loadIncomesBySales = () => {
        dispatch(Actions.LoadDefault.request({
            url: `/transactions/incomes-by-sales`,
            params: {
                extra: {
                    start_date: params.start_at && params.start_at,
                    end_date: params.end_at && params.end_at,
                }
            },
            cb: {
                success: data => {
                    setIncomesSalesTransactions(data)
                },
                error: data => {}
            }
        }))
    }

    useEffect(() => {
        loadExpensesByCategory()
        loadIncomesByCategory()
        loadIncomesBySales()
    }, [params.start_at,params.end_at])

    const cashSales = incomesSalesTransactions.find(i => i.price_type === 1) ? incomesSalesTransactions.find(i => i.price_type === 1).sum : 0;
    const terminalSales = incomesSalesTransactions.find(i => i.price_type === 4) ? incomesSalesTransactions.find(i => i.price_type === 4).sum : 0;
    const onlineSales = incomesSalesTransactions.find(i => i.price_type === 7) ? incomesSalesTransactions.find(i => i.price_type === 7).sum : 0;

    const totalSales = Number(cashSales)+Number(terminalSales)+Number(onlineSales);

    return (
        <div>
            <Board className='mb-30'>
                <Filter/>
            </Board>
            <div className="row mb-30">
                <div className="col-4">
                    <div className="dashboard-card-st">
                        <div className="dashboard-card-st__head">
                            <div className="--icon --icon-purple">
                                <img src={require("./icons/icon-4.svg")} alt="" />
                            </div>
                            <div className="--title">
                                <span>{t("Касса")}</span>
                                {(!params.start_at && !params.end_at) && (
                                    <span>За день</span>
                                )}
                            </div>
                        </div>
                        <div className="dashboard-card-st__body">
                            <div className="dashboard-line --green">
                                <span>{t("Приход")}</span>
                                <div>{helpers.convertToReadable(totalIncomes+totalSales)} сум</div>
                            </div>
                            <div className="dashboard-line --red">
                                <span>{t("Расход")}</span>
                                <div>{helpers.convertToReadable(totalExpenses)} сум</div>
                            </div>
                        </div>
                        <div className="dashboard-card-st__footer">
                            <span>{t("Остаток")}:</span>
                            <span>{helpers.convertToReadable(totalIncomes+totalSales-totalExpenses)} сум</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-4">
                    <div className="dashboard-card-st">
                        <div className="dashboard-card-st__head">
                            <div className="--icon --icon-blue">
                                <img src={require("./icons/icon-2.svg")} alt="" />
                            </div>
                            <div className="--title">
                                <span>{t("Приход")}</span>
                                {(!params.start_at && !params.end_at) && (
                                    <span>За день</span>
                                )}
                            </div>
                        </div>

                        <div className="dashboard-card-st__body">
                            <div className='dashboard-line --purple'>
                                <span>Продаж</span>
                                <div>{helpers.convertToReadable(totalSales)} сум</div>
                            </div>
                            {incomesTransactions.length > 0 ? (
                                incomesTransactions.map(item => (
                                    <div className="dashboard-line --purple">
                                        <span>{item.title}</span>
                                        <div>{item.sum ? helpers.convertToReadable(item.sum) : 0} сум</div>
                                    </div>
                                ))
                            ) : (
                                <div>-</div>
                            )}
                        </div>
                        <div className="dashboard-card-st__footer">
                            <span>{t("Oбщая сумма")}:</span>
                            <span>{helpers.convertToReadable(totalIncomes+totalSales)} сум</span>
                        </div>
                    </div>
                </div>

                <div className="col-4">
                    <div className="dashboard-card-st">
                        <div className="dashboard-card-st__head">
                            <div className="--icon --icon-orange">
                                <img src={require("./icons/icon-3.svg")} alt="" />
                            </div>
                            <div className="--title">
                                <span>{t("Расходы")}</span>
                                {(!params.start_at && !params.end_at) && (
                                    <span>За день</span>
                                )}
                            </div>
                        </div>
                        <div className="dashboard-card-st__body">
                            {expensesTransactions.length > 0 ? (
                                expensesTransactions.map(item => (
                                    <div className="dashboard-line --purple">
                                        <span>{item.title}</span>
                                        <div>{item.sum ? helpers.convertToReadable(item.sum) : 0} сум</div>
                                    </div>
                                ))
                            ) : (
                                <div>-</div>
                            )}
                        </div>
                        <div className="dashboard-card-st__footer">
                            <span>{t("Oбщая сумма")}:</span>
                            <span>{helpers.convertToReadable(totalExpenses)} сум</span>
                        </div>
                    </div>
                </div>

                <div className="col-4">
                    <div className="dashboard-card-st">
                        <div className="dashboard-card-st__head">
                            <div className="--icon --icon-green">
                                <img src={require("./icons/icon-1.svg")} alt="" />
                            </div>
                            <div className="--title">
                                <span>{t("Сумма продаж")}</span>
                                {(!params.start_at && !params.end_at) && (
                                    <span>За день</span>
                                )}
                            </div>
                        </div>
                        <div className="dashboard-card-st__body">
                            <div className="dashboard-line --purple">
                                <span>{t("Наличеые")}</span>
                                <div>{helpers.convertToReadable(cashSales)} сум</div>
                            </div>
                            <div className="dashboard-line --purple">
                                <span>{t("Терминал")}</span>
                                <div>{helpers.convertToReadable(terminalSales)} сум</div>
                            </div>
                            <div className="dashboard-line --purple">
                                <span>{t("Онлайн")}</span>
                                <div>{helpers.convertToReadable(onlineSales)} сум</div>
                            </div>
                        </div>
                        <div className="dashboard-card-st__footer">
                            <span>{t("Oбщая сумма")}:</span>
                            <span>{helpers.convertToReadable(totalSales)} сум</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;