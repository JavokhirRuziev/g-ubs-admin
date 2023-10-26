import React, { useState } from "react";
import Filter from "./Filter";
import { Board } from "../../components";
import qs from "query-string";
import ExpensesCard from "./components/expensesCard";
import ExpensesCardCopy from "./components/expensesCardCopy";
import IncomesCard from "./components/incomesCard";
import SalesCard from "./components/salesCard";
import CashboxCard from "./components/cashboxCard";
import CashboxCardCopy from "./components/cashboxCardCopy";
import CreditorCard from "./components/creditorCard";
import CreditorCardCopy from "./components/creditorCardCopy";
import TotalCard from "./components/totalCard";
import DebitCard from "./components/debitCard";
import DebitCardCopy from "./components/debitCardCopy";
import useMediaQueries from "../../services/media-queries";
import IncomesCardCopy from "./components/incomesCardCopy";

const Statistics = ({ location, history }) => {
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
					<IncomesCard
						{...{ history, location, params, setTotalIncome }}
					/>
				</div>

				<div className={`${!mobile ? "col-6 mb-30" : "col-12 mb-30"}`}>
					<SalesCard
						{...{ history, location, params, setTotalSale }}
					/>
				</div>

				<div className={`${!mobile ? "col-6 mb-30" : "col-12 mb-30"}`}>
					<CreditorCard
						{...{ history, location, params, setTotalCreditor }}
					/>
				</div>

				<div className={`${!mobile ? "col-6 mb-30" : "col-12 mb-30"}`}>
					<CashboxCard
						{...{
							history,
							location,
							params,
							totalExpense,
							totalIncome
						}}
					/>
				</div>
				<div className={`${!mobile ? "col-6 mb-30" : "col-12 mb-30"}`}>
					<ExpensesCard {...{ params, location }} />
				</div>
				<div className={`${!mobile ? "col-6 mb-30" : "col-12 mb-30"}`}>
					<DebitCard {...{ params, setTotalDebtor, location }} />
				</div>
				<div className={`${!mobile ? "col-6 mb-30" : "col-12 mb-30"}`}>
					<IncomesCardCopy {...{ params, location }} />
				</div>
				<div className={`${!mobile ? "col-6 mb-30" : "col-12 mb-30"}`}>
					<ExpensesCardCopy
						{...{ params, setTotalExpense, location }}
					/>
				</div>
				<div className={`${!mobile ? "col-6 mb-30" : "col-12 mb-30"}`}>
					<CreditorCardCopy {...{ params, location }} />
				</div>
				<div className={`${!mobile ? "col-6 mb-30" : "col-12 mb-30"}`}>
					<CashboxCardCopy
						{...{
							params,
							setTotalExpense,
							location,
							setTotalDebtor,
							setTotalCreditor,
							totalIncome,
							totalExpense
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default Statistics;
