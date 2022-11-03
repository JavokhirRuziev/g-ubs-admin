import React, {useEffect, useState} from 'react';
import {helpers} from "../../../services";
import {useTranslation} from "react-i18next";
import Actions from "../../../modules/entity/actions";
import {useDispatch} from "react-redux";

const CashboxCard = ({params, totalExpense, totalIncome}) => {
    const {t} = useTranslation();
    const dispatch = useDispatch()

    const [solves, setSolves] = useState([]);
    const [residual, setResidual] = useState([]);

    const loadSolves = () => {
        dispatch(Actions.LoadDefault.request({
            url: `/transactions/solves`,
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

    const loadResidualByPaymentType = () => {
        dispatch(Actions.LoadDefault.request({
            url: `/transactions/residual-by-payment-type`,
            params: {
                extra: {
                    start_date: params.start_at && params.start_at,
                    end_date: params.end_at && params.end_at,
                }
            },
            cb: {
                success: data => {
                    setResidual(data)
                },
                error: data => {}
            }
        }))
    }

    useEffect(() => {
        loadSolves();
        loadResidualByPaymentType()
    }, [params.start_at,params.end_at])

    return (
        <div className="dashboard-card-st">
            <div className="dashboard-card-st__head">
                <div className="--icon --icon-purple">
                    <img src={require("../icons/icon-4.svg")} alt="" />
                </div>
                <div className="--title">
                    <span>{t("Касса")}</span>
                    {(!params.start_at && !params.end_at) ? (
                        <span>{t("За день")}</span>
                    ) : (
                        <span>{t("За выбранный период")}</span>
                    )}
                </div>
            </div>
            <div className="dashboard-card-st__body">
                <div className="dashboard-line --purple">
                    <span>{t("Приход")}</span>
                    <div>{totalIncome ? helpers.convertToReadable(totalIncome) : 0} {t("сум")}</div>
                </div>
                <div className="dashboard-line --purple">
                    <span>{t("Расход")}</span>
                    <div>{totalExpense ? helpers.convertToReadable(totalExpense) : 0} {t("сум")}</div>
                </div>
                <div className="dashboard-line --purple">
                    <span>{t("Снять денги")}</span>
                    <div>{helpers.convertToReadable(solves)} {t("сум")}</div>
                </div>

                <div className="mt-20"/>

                {residual && Object.keys(residual).length > 0 ? (
                    Object.keys(residual).map(item => {
                        return(
                            <div className="dashboard-line --green">
                                {item === 'cash' && <span>{t("Наличные")}</span>}
                                {item === 'online' && <span>{t("Онлайн")}</span>}
                                {item === 'terminal' && <span>{t("Терминал")}</span>}
                                <div>
                                    {residual[item] ? helpers.convertToReadable(residual[item]) : 0} {t("сум")}
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div/>
                )}
            </div>
            <div className="dashboard-card-st__footer">
                <span>{t("Oбщая сумма")}:</span>
                <span>{helpers.convertToReadable(totalIncome-solves-totalExpense)} {t("сум")}</span>
            </div>
        </div>
    );
};

export default CashboxCard;