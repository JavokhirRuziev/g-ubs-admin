import React from 'react';
import DashboardChart from "./dashboardChart";
import "./style.scss";

const Index = () => {
    return (
        <div>
            <div className="title-md mb-20">Dashboard</div>
            <div className="dashboard-block">
                <div className="dashboard-block__left">
                    <DashboardChart/>
                </div>
                <div className="dashboard-block__right">
                    <div className="dashboard-card">
                        <div>
                            <div className="dashboard-card__label">Количество заказов</div>
                            <div className="dashboard-card__num">
                                <span>182</span>
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
                                <span>77</span>
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
                                <span>99</span>
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
                                <span>200</span>
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