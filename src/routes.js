import React, { lazy, Suspense } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { history } from "store";
import { Redirect } from "react-router";

import {Layout} from "components";
import {Spinner} from "components";
import App from "./App";

const Categories = lazy(() => import("./pages/Categories"));

const Settings = lazy(() => import("./pages/Settings/List"));
const SettingsCreate = lazy(() => import("./pages/Settings/Create"));
const SettingsUpdate = lazy(() => import("./pages/Settings/Update"));
const Translation = lazy(() => import("./pages/Translation"));
const Users = lazy(() => import("./pages/Users/List"));
const Profile = lazy(() => import("./pages/Profile"));

const Login = lazy(() => import("./pages/Login"));
const Logout = lazy(() => import("./pages/Login/Logout"));

const routes = [
	{ path: "/categories", exact: true, component: Categories },

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
