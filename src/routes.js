import React, { lazy, Suspense } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { history } from "store";
import { Redirect } from "react-router";

import {Layout} from "components";
import {Spinner} from "components";
import App from "./App";

// const Home = lazy(() => import("./pages/Home"));
const CategoriesPosts = lazy(() => import("./pages/Categories/Posts/List"));
const CategoriesProducts = lazy(() => import("./pages/Categories/Products/List"));

const GalleryPhoto = lazy(() => import("./pages/Gallery/Photo/List"));
const GalleryPhotoCreate = lazy(() => import("./pages/Gallery/Photo/Create"));
const GalleryPhotoUpdate = lazy(() => import("./pages/Gallery/Photo/Update"));
const GalleryVideo = lazy(() => import("./pages/Gallery/Video/List"));
const GalleryVideoCreate = lazy(() => import("./pages/Gallery/Video/Create"));
const GalleryVideoUpdate = lazy(() => import("./pages/Gallery/Video/Update"));

const Posts = lazy(() => import("./pages/Posts/News/List"));
const PostsCreate = lazy(() => import("./pages/Posts/News/Create"));
const PostsUpdate = lazy(() => import("./pages/Posts/News/Update"));
const Blogs = lazy(() => import("./pages/Posts/Blog/List"));
const BlogsCreate = lazy(() => import("./pages/Posts/Blog/Create"));
const BlogsUpdate = lazy(() => import("./pages/Posts/Blog/Update"));

const Products = lazy(() => import("./pages/Products/List"));
const ProductsCreate = lazy(() => import("./pages/Products/Create"));
const ProductsUpdate = lazy(() => import("./pages/Products/Update"));

const Pages = lazy(() => import("./pages/Pages/List"));
const PagesCreate = lazy(() => import("./pages/Pages/Create"));
const PagesUpdate = lazy(() => import("./pages/Pages/Update"));
const AdSupportSubjects = lazy(() => import("./pages/AdSupportSubjects/List"));
const AdSupport = lazy(() => import("./pages/AdSupport/List"));
const AdSupportCreate = lazy(() => import("./pages/AdSupport/Create"));
const AdSupportUpdate = lazy(() => import("./pages/AdSupport/Update"));
const Banners = lazy(() => import("./pages/Banner/List"));
const Partners = lazy(() => import("./pages/Partners/List"));

const Locations = lazy(() => import("./pages/Locations"));
const LocationsCreate = lazy(() => import("./pages/Locations/Create"));
const LocationsUpdate = lazy(() => import("./pages/Locations/Update"));

const Settings = lazy(() => import("./pages/Settings/List"));
const SettingsCreate = lazy(() => import("./pages/Settings/Create"));
const SettingsUpdate = lazy(() => import("./pages/Settings/Update"));
const Menu = lazy(() => import("./pages/Menu/List"));
const MenuView = lazy(() => import("./pages/Menu/View"));
const Tags = lazy(() => import("./pages/Tags/List"));
const Map = lazy(() => import("./pages/Map"));
const Feedback = lazy(() => import("./pages/Feedback/List"));
const FeedbackUpdate = lazy(() => import("./pages/Feedback/Update"));
const Translation = lazy(() => import("./pages/Translation"));
const Users = lazy(() => import("./pages/Users/List"));
const Login = lazy(() => import("./pages/Login"));
const Logout = lazy(() => import("./pages/Login/Logout"));
const Faq = lazy(() => import("./pages/Faq/List"));
const UpdateFaq = lazy(() => import("./pages/Faq/Update"));
const CreateFaq = lazy(() => import("./pages/Faq/Create"));
const Profile = lazy(() => import("./pages/Profile"));

const routes = [
	{ path: "/categories/posts", exact: true, component: CategoriesPosts },
	{ path: "/categories/products", exact: true, component: CategoriesProducts },

	{ path: "/gallery/photo", exact: true, component: GalleryPhoto },
	{ path: "/gallery/photo/create", exact: true, component: GalleryPhotoCreate },
	{ path: "/gallery/photo/update/:id", exact: true, component: GalleryPhotoUpdate },
	{ path: "/gallery/video", exact: true, component: GalleryVideo },
	{ path: "/gallery/video/create", exact: true, component: GalleryVideoCreate },
	{ path: "/gallery/video/update/:id", exact: true, component: GalleryVideoUpdate },

	{ path: "/posts", exact: true, component: Posts },
	{ path: "/posts/create", exact: true, component: PostsCreate },
	{ path: "/posts/update/:id", exact: true, component: PostsUpdate },
	{ path: "/blogs", exact: true, component: Blogs },
	{ path: "/blogs/create", exact: true, component: BlogsCreate },
	{ path: "/blogs/update/:id", exact: true, component: BlogsUpdate },

	{ path: "/products", exact: true, component: Products },
	{ path: "/products/create", exact: true, component: ProductsCreate },
	{ path: "/products/update/:id", exact: true, component: ProductsUpdate },


	{ path: "/pages", exact: true, component: Pages },
	{ path: "/pages/create", exact: true, component: PagesCreate },
	{ path: "/pages/update/:id", exact: true, component: PagesUpdate },
	{ path: "/ad-support/subjects/:parent_id", exact: true, component: AdSupportSubjects },
	{ path: "/ad-support", exact: true, component: AdSupport },
	{ path: "/ad-support/create", exact: true, component: AdSupportCreate },
	{ path: "/ad-support/update/:id", exact: true, component: AdSupportUpdate },
	{ path: "/banners", exact: true, component: Banners },
	{ path: "/partners", exact: true, component: Partners },

	{path: "/locations", exact: true, component: Locations},
	{path: "/locations/create", exact: true, component: LocationsCreate},
	{path: "/locations/update/:id", exact: true, component: LocationsUpdate},

	{ path: "/", exact: true, component: Posts },
	{ path: "/logout", exact: true, component: Logout },
	{ path: "/menu", exact: true, component: Menu },
	{ path: "/menu/:id", exact: true, component: MenuView },
	{ path: "/settings", exact: true, component: Settings },
	{ path: "/settings/create", exact: true, component: SettingsCreate },
	{ path: "/settings/update/:id", exact: true, component: SettingsUpdate },
	{ path: "/tags", exact: true, component: Tags },
	{ path: "/feedback", exact: true, component: Feedback },
	{ path: "/feedback/update/:id", exact: true, component: FeedbackUpdate },
	{ path: "/map", exact: true, component: Map },
	{ path: "/users", exact: true, component: Users },
	{ path: "/translation", exact: true, component: Translation },
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
