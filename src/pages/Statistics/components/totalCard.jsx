import React from 'react';
import {helpers} from "../../../services";
import {useTranslation} from "react-i18next";

const TotalCard = ({params, totalExpense, totalSale, totalCreditor}) => {
    const {t} = useTranslation();

    const total = totalSale-totalExpense-totalCreditor;

    return (
        <div className="dashboard-card-st">
            <div className="dashboard-card-st__head">
                <div className="--icon --icon-purple">
                    <img src={require("../icons/icon-4.svg")} alt="" />
                </div>
                <div className="--title">
                    <span>{t("Выгода-Вред")}</span>
                    {(!params.start_at && !params.end_at) ? (
                        <span>За день</span>
                    ) : (
                        <span>За выбранный период</span>
                    )}
                </div>
            </div>
            <div className="dashboard-card-st__body">
                <div className="dashboard-line --purple">
                    <span>Сумма продаж</span>
                    <div>{totalSale ? helpers.convertToReadable(totalSale) : 0} сум</div>
                </div>
                <div className="dashboard-line --purple">
                    <span>Расход</span>
                    <div>{totalExpense ? helpers.convertToReadable(totalExpense) : 0} сум</div>
                </div>
                <div className="dashboard-line --purple">
                    <span>Кредиторка</span>
                    <div>{totalCreditor ? helpers.convertToReadable(totalCreditor) : 0} сум</div>
                </div>
            </div>
            {total > 0 ? (
                <div className="dashboard-card-st__footer" style={{backgroundColor:"#2ab942"}}>
                    <span>{t("Выгода")}:</span>
                    <span style={{color: '#ffffff'}}>{helpers.convertToReadable(totalSale-totalExpense-totalCreditor)} сум</span>
                </div>

            ) : (
                <div className="dashboard-card-st__footer" style={{backgroundColor:"#f53c3c"}}>
                    <span>{t("Вред")}:</span>
                    <span style={{color: '#ffffff'}}>{helpers.convertToReadable(totalSale-totalExpense-totalCreditor)} сум</span>
                </div>
            )}
        </div>
    );
};

export default TotalCard;