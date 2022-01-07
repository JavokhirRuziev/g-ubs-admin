import React, { lazy, Suspense } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { history } from "store";
import { Redirect } from "react-router";

import {Layout} from "components";
import {Spinner} from "components";
import App from "./App";

const Categories = lazy(() => import("./pages/Categories"));
const Menus = lazy(() => import("./pages/Menus"));

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
const Users = lazy(() => import("./pages/Users/List"));
const Profile = lazy(() => import("./pages/Profile"));

const Login = lazy(() => import("./pages/Login"));
const Logout = lazy(() => import("./pages/Login/Logout"));

const routes = [
	{ path: "/", exact: true, component: Dishes },
	{ path: "/categories", exact: true, component: Categories },
	{ path: "/menus", exact: true, component: Menus },

	{ path: "/companies", exact: true, component: Companies },
	{ path: "/companies/create", exact: true, component: CompaniesCreate },
	{ path: "/companies/update/:id", exact: true, component: CompaniesUpdate },

	{ path: "/dishes", exact: true, component: Dishes },
	{ path: "/dishes/create", exact: true, component: DishesCreate },
	{ path: "/dishes/update/:id", exact: true, component: DishesUpdate },

	{ path: "/settings", exact: true, component: Settings },
	{ path: "/settings/create", exact: true, component: SettingsCreate },
	{ path: "/settings/update/:id", exact: true, component: SettingsUpdate },

	{ path: "/users", exact: true, component: Users },
	{ path: "/translation", exact: true, component: Translation },
	{ path: "/profile", exact: true, component: Profile },
	{ path: "/logout", exact: true, component: Logout },
];

export default () => (
	<Router {...{ history }}>
    <App>
      {({ isFetched, isAuthenticated }) => (
        isFetched && (
          isAuthenticated ? (
            <Layout>
              <Suspense fallback={<Spinner position={"full"}/>}>
                <Switch>
                  {routes.map((route, key) => (
                    <Route
                      key={key}
                      path={route.path}
                      component={route.component}
                      exact
                    />
                  ))}
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
