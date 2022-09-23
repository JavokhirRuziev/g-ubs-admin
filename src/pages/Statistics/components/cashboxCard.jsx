import React, {useEffect, useState} from 'react';
import {helpers} from "../../../services";
import {useTranslation} from "react-i18next";
import Actions from "../../../modules/entity/actions";
import {useDispatch} from "react-redux";
import get from "lodash/get";

const CashboxCard = ({params, totalExpense, totalIncome}) => {
    const {t} = useTranslation();
    const dispatch = useDispatch()

    const [solves, setSolves] = useState([]);

    const loadSolves = () => {
        dispatch(Actions.LoadDefault.request({
            url: `/transactions/solves-by-payment-type`,
            params: {
                extra: {
                    start_date: params.start_at && params.start_at,
                    end_date: params.end_at && params.end_at,
                }
            },
            cb: {
                success: data => {
                    setSolves(data)
                },
                error: data => {}
            }
        }))
    }

    useEffect(() => {
        loadSolves()
    }, [params.start_at,params.end_at])


    const cash = solves.find(s => s.price_type === 1);
    const terminal = solves.find(s => s.price_type === 4);
    const online = solves.find(s => s.price_type === 7);

    const totalSolves = Number(get(cash, 'sum', 0)) + Number(get(terminal, 'sum', 0)) + Number(get(online, 'sum', 0))
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
                    <div>{totalIncome ? helpers.convertToReadable(totalIncome) : 0} сум</div>
                </div>
                <div className="dashboard-line --purple">
                    <span>Расход</span>
                    <div>{totalExpense ? helpers.convertToReadable(totalExpense) : 0} сум</div>
                </div>
                <div className="dashboard-line --purple">
                    <span>Снять денги</span>
                    <div>{helpers.convertToReadable(totalSolves)} сум</div>
                </div>
                <div className="dashboard-line --purple ml-20">
                    <span>Наличные</span>
                    <div>{cash ? helpers.convertToReadable(cash.sum) : 0} сум</div>
                </div>
                <div className="dashboard-line --purple ml-20">
                    <span>Терминал</span>
                    <div>{terminal ? helpers.convertToReadable(terminal.sum) : 0} сум</div>
                </div>
                <div className="dashboard-line --purple ml-20">
                    <span>Онлайн</span>
                    <div>{online ? helpers.convertToReadable(online.sum) : 0} сум</div>
                </div>
            </div>
            <div className="dashboard-card-st__footer">
                <span>{t("Oбщая сумма")}:</span>
                <span>{helpers.convertToReadable(totalIncome-totalSolves-totalExpense)} сум</span>
            </div>
        </div>
    );
};

export default CashboxCard;