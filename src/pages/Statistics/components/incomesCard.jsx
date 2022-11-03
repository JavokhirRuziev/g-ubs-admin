import React, {useEffect, useState} from 'react';
import {helpers} from "services";
import Actions from "modules/entity/actions";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import config from "config";

const IncomesCard = ({params, setTotalIncome}) => {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const [categories, setCategories] = useState([]);
    const [incomesTransactions, setIncomesTransactions] = useState([]);
    const [totalIncomes, setTotalIncomes] = useState(0);

    const loadTotalsByCategory = () => {
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
                    const total = data.reduce((prev,curr) => prev+Number(curr.sum), 0)

                    setIncomesTransactions(data)
                    setTotalIncomes(total)
                    setTotalIncome(total)
                },
                error: data => {}
            }
        }))
    }
    const loadCategories = () => {
        dispatch(Actions.LoadDefault.request({
            url: `/expense-categories`,
            params: {
                filter: {type: config.INCOME_CATEGORY_TYPE}
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
        loadCategories()
    }, [])
    useEffect(() => {
        loadTotalsByCategory()
    }, [params.start_at,params.end_at])

    return (
        <div className="dashboard-card-st">
            <div className="dashboard-card-st__head">
                <div className="--icon --icon-blue">
                    <img src={require("../icons/icon-2.svg")} alt="" />
                </div>
                <div className="--title">
                    <span>{t("Приход")}</span>
                    {(!params.start_at && !params.end_at) ? (
                        <span>{t("За день")}</span>
                    ) : (
                        <span>{t("За выбранный период")}</span>
                    )}
                </div>
            </div>
            <div className="dashboard-card-st__body">
                {categories.length > 0 ? (
                    categories.map(item => {
                        const hasSum = incomesTransactions.find(a => a.alias === item.alias)
                        return(
                            <div className="dashboard-line --purple">
                                <span>{item.title}</span>
                                <div>{hasSum ? helpers.convertToReadable(hasSum.sum) : 0} {t("сум")}</div>
                            </div>
                        )
                    })
                ) : (
                    <div>-</div>
                )}
            </div>
            <div className="dashboard-card-st__footer">
                <span>{t("Oбщая сумма")}:</span>
                <span>{helpers.convertToReadable(totalIncomes)} {t("сум")}</span>
            </div>
        </div>
    );
};

export default IncomesCard;