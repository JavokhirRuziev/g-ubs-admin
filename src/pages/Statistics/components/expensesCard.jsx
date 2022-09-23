import React, {useEffect, useState} from 'react';
import {helpers} from "services";
import Actions from "modules/entity/actions";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import config from "../../../config";

const ExpensesCard = ({params, setTotalExpense}) => {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const [categories, setCategories] = useState([]);
    const [expensesTransactions, setExpensesTransactions] = useState([]);
    const [totalExpenses, setTotalExpenses] = useState(0);

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
                    const total = data.reduce((prev,curr) => prev+Number(curr.sum), 0)

                    setExpensesTransactions(data)
                    setTotalExpenses(total)
                    setTotalExpense(total)
                },
                error: data => {}
            }
        }))
    }
    const loadExpenseCategories = () => {
        dispatch(Actions.LoadDefault.request({
            url: `/expense-categories`,
            params: {
                filter: {type: config.EXPENSE_CATEGORY_TYPE}
            },
            cb: {
                success: data => {
                    setCategories(data.data)
                },
                error: data => {}
            }
        }))
    }

    useEffect(() => {
        loadExpenseCategories()
    }, [])
    useEffect(() => {
        loadExpensesByCategory()
    }, [params.start_at,params.end_at])

    return (
        <div className="dashboard-card-st">
            <div className="dashboard-card-st__head">
                <div className="--icon --icon-orange">
                    <img src={require("../icons/icon-3.svg")} alt="" />
                </div>
                <div className="--title">
                    <span>{t("Расходы")}</span>
                    {(!params.start_at && !params.end_at) ? (
                        <span>За день</span>
                    ) : (
                        <span>За выбранный период</span>
                    )}
                </div>
            </div>
            <div className="dashboard-card-st__body">
                {categories.length > 0 ? (
                    categories.map(item => {
                        const hasSum = expensesTransactions.find(a => a.alias === item.alias)
                        return(
                            <div className="dashboard-line --red">
                                <span>{item.title}</span>
                                <div>{hasSum ? helpers.convertToReadable(hasSum.sum) : 0} сум</div>
                            </div>
                        )
                    })
                ) : (
                    <div>-</div>
                )}
            </div>
            <div className="dashboard-card-st__footer">
                <span>{t("Oбщая сумма")}:</span>
                <span>{helpers.convertToReadable(totalExpenses)} сум</span>
            </div>
        </div>
    );
};

export default ExpensesCard;