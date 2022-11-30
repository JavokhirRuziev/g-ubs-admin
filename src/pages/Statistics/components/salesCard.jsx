import React, {useEffect, useState} from 'react';
import {helpers} from "../../../services";
import {useTranslation} from "react-i18next";
import Actions from "../../../modules/entity/actions";
import {useDispatch} from "react-redux";

const SalesCard = ({params, setTotalSale}) => {
    const {t} = useTranslation("");
    const dispatch = useDispatch()

    const [totalSales, setTotalSales] = useState(0);
    const [incomesSalesTransactions, setIncomesSalesTransactions] = useState([]);

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
                    const total = data.reduce((prev,curr) => prev+Number(curr.sum), 0);
                    const totalA = data.filter(i => i.price_type !== 5).reduce((prev,curr) => prev+Number(curr.sum), 0)

                    setIncomesSalesTransactions(data)
                    setTotalSales(total)
                    setTotalSale(total)
                },
                error: data => {}
            }
        }))
    }

    useEffect(() => {
        loadIncomesBySales()
    }, [params.start_at,params.end_at])

    const paymentTypes = [
        { price_type: 1, title: "Наличные" },
        { price_type: 4, title: "Терминал" },
        { price_type: 7, title: "Онлайн" },
        { price_type: 5, title: "Долг" },
        { price_type: 6, title: "VIP" },
    ];
    return (
        <div className="dashboard-card-st">
            <div className="dashboard-card-st__head">
                <div className="--icon --icon-green">
                    <img src={require("../icons/icon-1.svg")} alt="" />
                </div>
                <div className="--title">
                    <span>{t("Сумма продаж")}</span>
                    {(!params.start_at && !params.end_at) ? (
                        <span>{t("За день")}</span>
                    ) : (
                        <span>{t("За выбранный период")}</span>
                    )}
                </div>
            </div>
            <div className="dashboard-card-st__body">
                {paymentTypes.map(item => {
                    const hasSum = incomesSalesTransactions.find(t => t.price_type === item.price_type);
                    return(
                        <div className="dashboard-line --purple">
                            <span>{item.title}</span>
                            <div>{hasSum ? helpers.convertToReadable(hasSum.sum) : 0} {t("сум")}</div>
                        </div>
                    )
                })}
            </div>
            <div className="dashboard-card-st__footer">
                <span>{t("Oбщая сумма")}:</span>
                <span>{helpers.convertToReadable(totalSales)} {t("сум")}</span>
            </div>
        </div>
    );
};

export default SalesCard;