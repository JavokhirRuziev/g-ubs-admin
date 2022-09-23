import React, {useEffect, useState} from 'react';
import {helpers} from "../../../services";
import {useTranslation} from "react-i18next";
import Actions from "../../../modules/entity/actions";
import {useDispatch} from "react-redux";

const CashboxCard = ({params}) => {
    const {t} = useTranslation();
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

                    setIncomesSalesTransactions(data)
                    setTotalSales(total)
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
                <div className="--icon --icon-purple">
                    <img src={require("../icons/icon-4.svg")} alt="" />
                </div>
                <div className="--title">
                    <span>{t("Касса")}</span>
                    {(!params.start_at && !params.end_at) ? (
                        <span>За день</span>
                    ) : (
                        <span>За выбранный период</span>
                    )}
                </div>
            </div>
            <div className="dashboard-card-st__body">
                <div className="dashboard-line --purple">
                    <span>Приход</span>
                    <div>{0} сум</div>
                </div>
                <div className="dashboard-line --purple">
                    <span>Расход</span>
                    <div>{0} сум</div>
                </div>
                <div className="dashboard-line --purple">
                    <span>Снять денги</span>
                    <div>{0} сум</div>
                </div>
                <div className="dashboard-line --purple ml-20">
                    <span>Наличные</span>
                    <div>{0} сум</div>
                </div>
                <div className="dashboard-line --purple ml-20">
                    <span>Терминал</span>
                    <div>{0} сум</div>
                </div>
                <div className="dashboard-line --purple ml-20">
                    <span>Онлайн</span>
                    <div>{0} сум</div>
                </div>
            </div>
            <div className="dashboard-card-st__footer">
                <span>{t("Oбщая сумма")}:</span>
                <span>{helpers.convertToReadable(totalSales)} сум</span>
            </div>
        </div>
    );
};

export default CashboxCard;