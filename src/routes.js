import React, { lazy, Suspense } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { history } from "store";
import { Redirect } from "react-router";

import {Layout} from "components";
import {Spinner} from "components";
import App from "./App";
import get from "lodash/get";

const Categories = lazy(() => import("./pages/Categories"));
const Menus = lazy(() => import("./pages/Menus"));
const Places = lazy(() => import("./pages/Places"));

const Companies = lazy(() => import("./pages/Companies/List"));
const CompaniesCreate = lazy(() => import("./pages/Companies/Create"));
const CompaniesUpdate = lazy(() => import("./pages/Companies/Update"));

const Dishes = lazy(() => import("./pages/Dishes/List"));
const DishesCreate = lazy(() => import("./pages/Dishes/Create"));
const DishesUpdate = lazy(() => import("./pages/Dishes/Update"));

const Settings = lazy(() => import("./pages/Settings/List"));
const SettingsCreate = lazy(() => import("./pages/Settings/Create"));
const SettingsUpdate = lazy(() => import("./pages/Settings/Update"));

const Translation = lazy(() => import("./pages/Translation"));
const Profile = lazy(() => import("./pages/Profile"));

const Login = lazy(() => import("./pages/Login"));
const Logout = lazy(() => import("./pages/Login/Logout"));

const UsersManager = lazy(() => import("./pages/Users/Managers/List"));
const UsersCompany = lazy(() => import("./pages/Users/Company/List"));


const routes = [
	{ path: "/", exact: true, component: Categories, access: ["admin"] },
	{ path: "/", exact: true, component: Dishes, access: ["company"] },
	{ path: "/categories", exact: true, component: Categories, access: ["admin"] },
	{ path: "/menus", exact: true, component: Menus, access: ["company"] },
	{ path: "/places", exact: true, component: Places, access: ["company"] },

	{ path: "/companies", exact: true, component: Companies, access: ["admin"] },
	{ path: "/companies/create", exact: true, component: CompaniesCreate, access: ["admin"] },
	{ path: "/companies/update/:id", exact: true, component: CompaniesUpdate, access: ["admin"] },

	{ path: "/dishes", exact: true, component: Dishes, access: ["company"] },
	{ path: "/dishes/create", exact: true, component: DishesCreate, access: ["company"] },
	{ path: "/dishes/update/:id", exact: true, component: DishesUpdate, access: ["company"] },

	{ path: "/settings", exact: true, component: Settings, access: ["admin"] },
	{ path: "/settings/create", exact: true, component: SettingsCreate, access: ["admin"] },
	{ path: "/settings/update/:id", exact: true, component: SettingsUpdate, access: ["admin"] },

	{ path: "/users/manager", exact: true, component: UsersManager, access: ["admin"] },
	{ path: "/users/content-manager", exact: true, component: UsersCompany, access: ["admin"] },
	{ path: "/translation", exact: true, component: Translation, access: ["admin"] },
	{ path: "/profile", exact: true, component: Profile, access: ["admin","manager","company"] },
	{ path: "/logout", exact: true, component: Logout, access: ["admin","manager","company"] }
];

const adminRoutes = routes.filter(i => i.access.includes("admin"));
const contentManagerRoutes = routes.filter(i => i.access.includes("company"));

export default () => (
	<Router {...{ history }}>
    <App>
      {({ isFetched, isAuthenticated, data }) => (
        isFetched && (
          isAuthenticated ? (
            <Layout>
              <Suspense fallback={<Spinner position={"full"}/>}>
                <Switch>
					{(get(data, 'success.role') === 'admin') && (
						adminRoutes.map((route, key) => (
							<Route
								key={key}
								path={route.path}
								component={route.component}
								exact
							/>
						))
					)}
					{(get(data, 'success.role') === 'company') && (
						contentManagerRoutes.map((route, key) => (
							<Route
								key={key}
								path={route.path}
								component={route.component}
								exact
							/>
						))
					)}
                </Switch>
              </Suspense>
            </Layout>
          ) : (
            <Suspense fallback={<Spinner position={"full"}/>}>
              <Switch>
                <Route path="/" component={Login} exact/>
                <Redirect from="*" to="/"/>
              </Switch>
            </Suspense>
          )
        )
      )}
    </App>
	</Router>
);
