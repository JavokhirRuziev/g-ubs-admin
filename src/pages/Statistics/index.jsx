import React, {useState} from 'react';
import Filter from "./Filter";
import {Board} from "../../components";
import qs from "query-string";
import ExpensesCard from "./components/expensesCard";
import IncomesCard from "./components/incomesCard";
import SalesCard from "./components/salesCard";
import CashboxCard from "./components/cashboxCard";

const Statistics = ({location}) => {
    const params = qs.parse(location.search, {ignoreQueryPrefix: true});
    const [totalExpense, setTotalExpense] = useState(0)
    const [totalIncome, setTotalIncome] = useState(0)

    return (
        <div>
            <Board className='mb-30'>
                <Filter/>
            </Board>
            <div className="row mb-30">
                <div className="col-4">
                    <IncomesCard {...{params, setTotalIncome}}/>
                </div>

                <div className="col-4">

                </div>
            </div>
            <div className="row">

                <div className="col-4">
                    <ExpensesCard {...{params, setTotalExpense}}/>
                </div>

                <div className="col-4">
                    <CashboxCard {...{params, totalExpense, totalIncome}}/>
                </div>

                <div className="col-4">
                    <SalesCard {...{params}}/>
                </div>
            </div>
        </div>
    );
};

export default Statistics;