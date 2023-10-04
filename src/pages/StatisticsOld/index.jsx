import React, { useState } from "react";
import Filter from "./Filter";
import { Board } from "../../components";
import qs from "query-string";
import ExpensesCard from "./components/expensesCard";
import IncomesCard from "./components/incomesCard";
import SalesCard from "./components/salesCard";
import CashboxCard from "./components/cashboxCard";
import CreditorCard from "./components/creditorCard";
import TotalCard from "./components/totalCard";
import DebitCard from "./components/debitCard";
import useMediaQueries from "../../services/media-queries";

const Statistics = ({ location }) => {
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const [totalExpense, setTotalExpense] = useState(0);
	const [totalIncome, setTotalIncome] = useState(0);
	const [totalSale, setTotalSale] = useState(0);
	const [totalCreditor, setTotalCreditor] = useState(0);
	const [totalDebtor, setTotalDebtor] = useState(0);
	const { mobile } = useMediaQueries();

	return (
		<div style={{ maxWidth: mobile ? "370px" : "100%" }}>
			<Board className="mb-30">
				<Filter />
			</Board>
			<div className="row mb-30">
				<div className="col-12">
					<TotalCard
						{...{
							params,
							totalExpense,
							totalIncome,
							totalSale,
							totalCreditor,
							totalDebtor
						}}
					/>
				</div>
			</div>
			<div className="row mb-30">
				<div className={`${mobile ? "col-12 mb-30" : "col-6 mb-30"}`}>
					<IncomesCard {...{ params, setTotalIncome }} />
				</div>

				<div className={`${!mobile ? "col-6 mb-30" : "col-12 mb-30"}`}>
					<CreditorCard {...{ params, setTotalCreditor }} />
				</div>

				<div className={`${!mobile ? "col-6 mb-30" : "col-12 mb-30"}`}>
					<CashboxCard {...{ params, totalExpense, totalIncome }} />
				</div>
				<div className={`${!mobile ? "col-6 mb-30" : "col-12 mb-30"}`}>
					<ExpensesCard {...{ params, setTotalExpense }} />
				</div>

				<div className={`${!mobile ? "col-6 mb-30" : "col-12 mb-30"}`}>
					<DebitCard {...{ params, setTotalDebtor }} />
				</div>

				<div className={`${!mobile ? "col-6 mb-30" : "col-12 mb-30"}`}>
					<SalesCard {...{ params, setTotalSale }} />
				</div>
			</div>
		</div>
	);
};

export default Statistics;
