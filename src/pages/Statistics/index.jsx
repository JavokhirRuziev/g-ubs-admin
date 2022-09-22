import React from 'react';
import Filter from "./Filter";
import {Board} from "../../components";
import qs from "query-string";
import ExpensesCard from "./components/expensesCard";
import IncomesCard from "./components/incomesCard";
import SalesCard from "./components/salesCard";

const Statistics = ({location}) => {
    const params = qs.parse(location.search, {ignoreQueryPrefix: true});

    return (
        <div>
            <Board className='mb-30'>
                <Filter/>
            </Board>
            <div className="row mb-30">
                <div className="col-4">
                    <IncomesCard {...{params}}/>
                </div>

                <div className="col-4">

                </div>
            </div>
            <div className="row">

                <div className="col-4">
                    <ExpensesCard {...{params}}/>
                </div>

                <div className="col-4">
                    <SalesCard {...{params}}/>
                </div>
            </div>
        </div>
    );
};

export default Statistics;