import React, { useEffect, useState } from "react";
import DashboardChart from "./dashboardChart";
import { useDispatch } from "react-redux";
import Actions from "modules/entity/actions";

import get from "lodash/get";
import "./style.scss";

const Index = () => {
    const dispatch = useDispatch();
    const [statistic, setStatistic] = useState(null);
    const [chartInfo, setChartInfo] = useState(null);
    const [isFetched, setFetched] = useState(false);

    const loadDashboardStat = () => {
        dispatch(Actions.LoadDefault.request({
            url: `/dashboard/total`,
            cb: {
                success: data => {
                    setStatistic(data)
                },
                error: () => {
                }
            }
        }))
    }
    const loadDashboardChart = () => {
        setFetched(false)
        dispatch(Actions.LoadDefault.request({
            url: `/dashboard/dashboard`,
            cb: {
                success: data => {
                    setChartInfo(data)
                    setFetched(true)
                },
                error: () => {
                }
            }
        }))
    }

    useEffect(() => {
        loadDashboardStat()
        loadDashboardChart()
    }, [])

    return (
        <div>
            <div className="title-md mb-20">Dashboard</div>
            <div className="dashboard-block">
                <div className="dashboard-block__left">
                    {isFetched && (
                        <DashboardChart {...{isFetched, chartInfo}}/>
                    )}
                </div>
                <div className="dashboard-block__right">
                    <div className="dashboard-card">
                        <div>
                            <div className="dashboard-card__label">Количество заказов</div>
                            <div className="dashboard-card__num">
                                <span>{get(statistic, 'orders', 0)}</span>
                                <span>шт</span>
                            </div>
                        </div>
                        <div>
                            <img src={require("./dashboard-icon.svg")} alt="" />
                        </div>
                    </div>
                    <div className="dashboard-card">
                        <div>
                            <div className="dashboard-card__label">Количество контрагентов</div>
                            <div className="dashboard-card__num">
                                <span>{get(statistic, 'companies', 0)}</span>
                                <span>шт</span>
                            </div>
                        </div>
                        <div>
                            <img src={require("./dashboard-icon.svg")} alt="" />
                        </div>
                    </div>
                    <div className="dashboard-card">
                        <div>
                            <div className="dashboard-card__label">Количество пользователей</div>
                            <div className="dashboard-card__num">
                                <span>{get(statistic, 'users', 0)}</span>
                                <span>шт</span>
                            </div>
                        </div>
                        <div>
                            <img src={require("./dashboard-icon.svg")} alt="" />
                        </div>
                    </div>
                    <div className="dashboard-card">
                        <div>
                            <div className="dashboard-card__label">Количество эды</div>
                            <div className="dashboard-card__num">
                                <span>{get(statistic, 'dishes', 0)}</span>
                                <span>шт</span>
                            </div>
                        </div>
                        <div>
                            <img src={require("./dashboard-icon.svg")} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;