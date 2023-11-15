import React, { lazy, Suspense } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { history } from "store";
import { Redirect } from "react-router";

import { Layout } from "components";
import { Spinner } from "components";
import App from "./App";
import get from "lodash/get";

const MonitoringWaiter = lazy(() => import("./pages/MonitoringWaiter"));
const DeletedDishes = lazy(() => import("./pages/DeletedDishes"));
const Monitoring = lazy(() => import("./pages/Monitoring"));
const Orders = lazy(() => import("./pages/Orders"));
const OrdersOnTable = lazy(() => import("./pages/OrdersOnTable"));
const Notification = lazy(() => import("./pages/Notification"));
const Faq = lazy(() => import("./pages/Faq"));
const Categories = lazy(() => import("./pages/Categories"));
const Units = lazy(() => import("./pages/Units"));
const PopularQueries = lazy(() => import("./pages/PopularQueries"));
const Reviews = lazy(() => import("./pages/Reviews"));
const Printers = lazy(() => import("./pages/Printers"));
const Banner = lazy(() => import("./pages/Banner"));
const Menus = lazy(() => import("./pages/Menus"));
const Places = lazy(() => import("./pages/Places"));
const Tables = lazy(() => import("./pages/Tables"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

const Company = lazy(() => import("./pages/Company/Update"));
const Companies = lazy(() => import("./pages/Companies/List"));
const CompaniesCreate = lazy(() => import("./pages/Companies/Create"));
const CompaniesUpdate = lazy(() => import("./pages/Companies/Update"));
const CompaniesView = lazy(() => import("./pages/Companies/View"));

const Dishes = lazy(() => import("./pages/Dishes/List"));
const DishesCreate = lazy(() => import("./pages/Dishes/Create"));
const DishesUpdate = lazy(() => import("./pages/Dishes/Update"));
const FinishedDishes = lazy(() => import("./pages/FinishedDishes/List"));
const FinishedDishesCreate = lazy(() =>
	import("./pages/FinishedDishes/Create")
);
const FinishedDishesUpdate = lazy(() =>
	import("./pages/FinishedDishes/Update")
);
const FinishedProduct = lazy(() =>
	import("./pages/Stock/FinishedProduct/index")
);
const FinishedProductUpdate = lazy(() =>
	import("./pages/Stock/FinishedProduct/components/Update")
);

const Settings = lazy(() => import("./pages/Settings/List"));
const SettingsCreate = lazy(() => import("./pages/Settings/Create"));
const SettingsUpdate = lazy(() => import("./pages/Settings/Update"));

const Translation = lazy(() => import("./pages/Translation"));
const Profile = lazy(() => import("./pages/Profile"));

const Login = lazy(() => import("./pages/Login"));
const Logout = lazy(() => import("./pages/Login/Logout"));
const SignUp = lazy(() => import("./pages/Login/SignUp"));

const UsersKitchener = lazy(() => import("./pages/Users/Kitchener/List"));
const UsersWaiter = lazy(() => import("./pages/Users/Waiter/List"));
const UsersManager = lazy(() => import("./pages/Users/Managers/List"));
const UsersCompany = lazy(() => import("./pages/Users/Company/List"));
const UsersPurveyor = lazy(() => import("./pages/Users/Purveyor/List"));

const Solved = lazy(() => import("./pages/Solved"));
const Incomes = lazy(() => import("./pages/Incomes"));
const Expenses = lazy(() => import("./pages/Expenses"));
const Statistics = lazy(() => import("./pages/Statistics"));

const Persons = lazy(() => import("./pages/Persons/List"));
const ClientView = lazy(() => import("./pages/Persons/components/ClientView"));
const PersonsTransactions = lazy(() => import("./pages/Persons/Transactions"));

const Stock = lazy(() => import("./pages/Stock/Stock"));
const ProductCategory = lazy(() => import("./pages/Stock/ProductCategory"));
const Products = lazy(() => import("./pages/Stock/Product"));
const RecalculationProducts = lazy(() =>
	import("./pages/Stock/Product/Recalculation/index")
);
const CrudBroughtProduct = lazy(() =>
	import("./pages/Stock/CrudBroughtProduct")
);
const CrudDistributedProduct = lazy(() =>
	import("./pages/Stock/CrudDistributedProduct")
);
const ConfirmationOfRecalculation = lazy(() =>
	import("./pages/ConfirmationOfRecalculation")
);

const routes = [
	{
		path: "/stock/stock/",
		exact: true,
		component: Stock,
		access: ["company"],
		role: "stock"
	},
	{
		path: "/stock/product-categories/",
		exact: true,
		component: ProductCategory,
		access: ["company"],
		role: "product_categories"
	},
	{
		path: "/confirmation-of-recalculation",
		exact: true,
		component: ConfirmationOfRecalculation,
		access: ["company"],
		role: "products"
	},
	{
		path: "/stock/products/",
		exact: true,
		component: Products,
		access: ["company"],
		role: "products"
	},
	{
		path: "/recalculation-products",
		exact: true,
		component: RecalculationProducts,
		access: ["company"],
		role: "products"
	},
	{
		path: "/stock/stock-brought-products/",
		exact: true,
		component: CrudBroughtProduct,
		access: ["company"],
		role: "brought_products"
	},
	{
		path: "/stock/stock-distributed-products/",
		exact: true,
		component: CrudDistributedProduct,
		access: ["company"],
		role: "distributed_products"
	},
	{
		path: "/persons",
		exact: true,
		component: Persons,
		access: ["company"],
		role: "customers"
	},
	{
		path: "/customers/transactions/:id",
		exact: true,
		component: PersonsTransactions,
		access: ["company"]
	},
	{
		path: "/expenses",
		exact: true,
		component: Expenses,
		access: ["company"],
		role: "transactions"
	},
	{
		path: "/incomes",
		exact: true,
		component: Incomes,
		access: ["company"],
		role: "transactions"
	},
	{
		path: "/solved",
		exact: true,
		component: Solved,
		access: ["company"],
		role: "transactions"
	},
	{
		path: "/statistics",
		exact: true,
		component: Statistics,
		access: ["company"]
	},
	{ path: "/", exact: true, component: Dashboard, access: ["admin"] },
	{
		path: "/",
		exact: true,
		component: Statistics,
		access: ["company"],
		role: "dashboard"
	},
	{
		path: "/monitoring-waiter",
		exact: true,
		component: MonitoringWaiter,
		access: ["company"],
		role: "monitoring_by_waiters"
	},
	{
		path: "/deleted-dishes",
		exact: true,
		component: DeletedDishes,
		access: ["company"],
		role: "deleted_dishes"
	},
	{
		path: "/monitoring",
		exact: true,
		component: Monitoring,
		access: ["company"],
		role: "monitoring_by_dishes"
	},
	{
		path: "/orders",
		exact: true,
		component: Orders,
		access: ["company"],
		role: "monitoring_by_orders"
	},
	{
		path: "/orders-on-table",
		exact: true,
		component: OrdersOnTable,
		access: ["company"],
		role: "monitoring_by_tables"
	},
	{
		path: "/notification",
		exact: true,
		component: Notification,
		access: ["admin"]
	},
	{ path: "/faq", exact: true, component: Faq, access: ["admin"] },
	{
		path: "/categories",
		exact: true,
		component: Categories,
		access: ["admin"]
	},
	{ path: "/units", exact: true, component: Units, access: ["admin"] },
	{
		path: "/popular-queries",
		exact: true,
		component: PopularQueries,
		access: ["admin"]
	},
	{ path: "/reviews", exact: true, component: Reviews, access: ["admin"] },
	{ path: "/banner", exact: true, component: Banner, access: ["admin"] },
	{
		path: "/printers",
		exact: true,
		component: Printers,
		access: ["company"],
		role: "printers"
	},
	{ path: "/menus", exact: true, component: Menus, access: ["company"] },
	{
		path: "/places",
		exact: true,
		component: Places,
		access: ["company"],
		role: "places"
	},
	{
		path: "/tables",
		exact: true,
		component: Tables,
		access: ["company"],
		role: "tables"
	},
	{
		path: "/dashboard",
		exact: true,
		component: Dashboard,
		access: ["company", "admin"]
	},
	{
		path: "/profile/company",
		exact: true,
		component: Company,
		access: ["company"],
		role: "company_profile"
	},
	{
		path: "/companies",
		exact: true,
		component: Companies,
		access: ["admin"]
	},
	{
		path: "/companies/create",
		exact: true,
		component: CompaniesCreate,
		access: ["admin"]
	},
	{
		path: "/companies/update/:id",
		exact: true,
		component: CompaniesUpdate,
		access: ["admin"]
	},
	{
		path: "/companies/view/:id",
		exact: true,
		component: CompaniesView,
		access: ["admin"]
	},
	{
		path: "/recalculation-finished-dishes",
		exact: true,
		component: FinishedProduct,
		access: ["company"]
	},
	{
		path: "/finished-product-update/:id",
		exact: true,
		component: FinishedProductUpdate,
		access: ["company"]
	},
	{
		path: "/dishes",
		exact: true,
		component: Dishes,
		access: ["company"],
		role: "dishes"
	},
	{
		path: "/dishes/create",
		exact: true,
		component: DishesCreate,
		access: ["company"],
		role: "dishes"
	},
	{
		path: "/dishes/update/:id",
		exact: true,
		component: DishesUpdate,
		access: ["company"],
		role: "dishes"
	},
	{
		path: "/finished-dishes",
		exact: true,
		component: FinishedDishes,
		access: ["company"],
		role: "dishes"
	},
	{
		path: "/finished-dishes/create",
		exact: true,
		component: FinishedDishesCreate,
		access: ["company"],
		role: "dishes"
	},
	{
		path: "/finished-dishes/update/:id",
		exact: true,
		component: FinishedDishesUpdate,
		access: ["company"],
		role: "dishes"
	},
	{ path: "/settings", exact: true, component: Settings, access: ["admin"] },
	{
		path: "/settings/create",
		exact: true,
		component: SettingsCreate,
		access: ["admin"]
	},
	{
		path: "/settings/update/:id",
		exact: true,
		component: SettingsUpdate,
		access: ["admin"]
	},
	{
		path: "/users/company-admins",
		exact: true,
		component: UsersCompany,
		access: ["admin"]
	},
	{
		path: "/users/waiter",
		exact: true,
		component: UsersWaiter,
		access: ["company"],
		role: "users"
	},
	{
		path: "/users/kitchener",
		exact: true,
		component: UsersKitchener,
		access: ["company"],
		role: "users"
	},
	{
		path: "/users/manager",
		exact: true,
		component: UsersManager,
		access: ["company"],
		role: "users"
	},
	{
		path: "/users/purveyer",
		exact: true,
		component: UsersPurveyor,
		access: ["company"],
		role: "users"
	},
	{
		path: "/translation",
		exact: true,
		component: Translation,
		access: ["admin"]
	},
	{
		path: "/profile",
		exact: true,
		component: Profile,
		access: ["admin", "manager", "company"]
	},
	{
		path: "/persons/client-view",
		exact: true,
		component: ClientView,
		access: ["admin", "manager", "company"]
	}
];

const adminRoutes = routes.filter(i => i.access.includes("admin"));
const contentManagerRoutes = routes.filter(i => i.access.includes("company"));

export default () => (
	<Router {...{ history }}>
		<App>
			{({ isFetched, isAuthenticated, data }) => {
				const access = contentManagerRoutes.filter(el => {
					if (
						data &&
						data.success &&
						data.success.roles &&
						data.success.roles.some(e => "dashboard" === e.role)
					) {
						return true;
					} else {
						return el.role !== "dashboard";
					}
				});
				return (
					isFetched &&
					(isAuthenticated ? (
						<Layout>
							<Suspense fallback={<Spinner position={"full"} />}>
								<Switch>
									{get(data, "success.role") === "admin"
										? adminRoutes.map((route, key) => (
												<Route
													key={key}
													path={route.path}
													component={route.component}
													exact
												/>
										  ))
										: access &&
										  access.map((route, key) => (
												<Route
													key={key}
													path={route.path}
													component={route.component}
													exact
												/>
										  ))}

									<Route
										path="/logout"
										component={Logout}
										exact
									/>
								</Switch>
							</Suspense>
						</Layout>
					) : (
						<Suspense fallback={<Spinner position={"full"} />}>
							<Switch>
								<Route path="/" component={Login} exact />
								<Route
									path="/signUp"
									component={SignUp}
									exact
								/>
								<Redirect from="*" to="/" />
							</Switch>
						</Suspense>
					))
				);
			}}
		</App>
	</Router>
);
