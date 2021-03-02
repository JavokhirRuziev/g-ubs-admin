import React, { lazy, Suspense } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { history } from "store";
import { Redirect } from "react-router";

import {Layout} from "components";
import {Spinner} from "components";
import App from "./App";

// const Home = lazy(() => import("./pages/Home"));
const Gallery = lazy(() => import("./pages/Gallery/List"));
const GalleryCreate = lazy(() => import("./pages/Gallery/Create"));
const GalleryUpdate = lazy(() => import("./pages/Gallery/Update"));
const Posts = lazy(() => import("./pages/Posts/List"));
const PostsCreate = lazy(() => import("./pages/Posts/Create"));
const PostsUpdate = lazy(() => import("./pages/Posts/Update"));
const Pages = lazy(() => import("./pages/Pages/List"));
const PagesCreate = lazy(() => import("./pages/Pages/Create"));
const PagesUpdate = lazy(() => import("./pages/Pages/Update"));
const Settings = lazy(() => import("./pages/Settings/List"));
const SettingsCreate = lazy(() => import("./pages/Settings/Create"));
const SettingsUpdate = lazy(() => import("./pages/Settings/Update"));
const Documents = lazy(() => import("./pages/Documents/List"));
const DocumentsCreate = lazy(() => import("./pages/Documents/Create"));
const DocumentsUpdate = lazy(() => import("./pages/Documents/Update"));
const Menu = lazy(() => import("./pages/Menu/List"));
const MenuView = lazy(() => import("./pages/Menu/View"));
const CategoriesUsefulLinks = lazy(() => import("./pages/Categories/UsefulLinks/List"));
const CategoriesPosts = lazy(() => import("./pages/Categories/Posts/List"));
const CategoriesDocuments = lazy(() => import("./pages/Categories/Documents/List"));
const Tags = lazy(() => import("./pages/Tags/List"));
const Map = lazy(() => import("./pages/Map"));
const Feedback = lazy(() => import("./pages/Feedback/List"));
const FeedbackUpdate = lazy(() => import("./pages/Feedback/Update"));
const Translation = lazy(() => import("./pages/Translation"));
const Users = lazy(() => import("./pages/Users/List"));
const Countries = lazy(() => import("./pages/Locations/Countries"));
const Regions = lazy(() => import("./pages/Locations/Regions"));
const Login = lazy(() => import("./pages/Login"));
const Logout = lazy(() => import("./pages/Login/Logout"));
const Faq = lazy(() => import("./pages/Faq/List"));
const UpdateFaq = lazy(() => import("./pages/Faq/Update"));
const CreateFaq = lazy(() => import("./pages/Faq/Create"));
const Profile = lazy(() => import("./pages/Profile"));

const routes = [
	{ path: "/", exact: true, component: Posts },
	{ path: "/logout", exact: true, component: Logout },
	{ path: "/gallery", exact: true, component: Gallery },
	{ path: "/gallery/create", exact: true, component: GalleryCreate },
	{ path: "/gallery/update/:id", exact: true, component: GalleryUpdate },
	{ path: "/menu", exact: true, component: Menu },
	{ path: "/menu/:alias", exact: true, component: MenuView },
	{ path: "/posts", exact: true, component: Posts },
	{ path: "/posts/create", exact: true, component: PostsCreate },
	{ path: "/posts/update/:id", exact: true, component: PostsUpdate },
	{ path: "/pages", exact: true, component: Pages },
	{ path: "/pages/create", exact: true, component: PagesCreate },
	{ path: "/pages/update/:id", exact: true, component: PagesUpdate },
	{ path: "/settings", exact: true, component: Settings },
	{ path: "/settings/create", exact: true, component: SettingsCreate },
	{ path: "/settings/update/:id", exact: true, component: SettingsUpdate },
	{ path: "/documents", exact: true, component: Documents },
	{ path: "/documents/create", exact: true, component: DocumentsCreate },
	{ path: "/documents/update/:id", exact: true, component: DocumentsUpdate },
	{ path: "/categories/useful-links", exact: true, component: CategoriesUsefulLinks },
	{ path: "/categories/posts", exact: true, component: CategoriesPosts },
	{ path: "/categories/documents", exact: true, component: CategoriesDocuments },
	{ path: "/tags", exact: true, component: Tags },
	{ path: "/feedback", exact: true, component: Feedback },
	{ path: "/feedback/update/:id", exact: true, component: FeedbackUpdate },
	{ path: "/map", exact: true, component: Map },
	{ path: "/users", exact: true, component: Users },
	{ path: "/translation", exact: true, component: Translation },
	{ path: "/countries", exact: true, component: Countries },
	{ path: "/regions", exact: true, component: Regions },
	{ path: "/faq", exact: true, component: Faq },
	{ path: "/faq/create", exact: true, component: CreateFaq },
	{ path: "/faq/update/:id", exact: true, component: UpdateFaq },
	{ path: "/profile", exact: true, component: Profile },
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
