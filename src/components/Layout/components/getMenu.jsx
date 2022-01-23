const adminMenus = [
    {
        id: 'category',
        title: "Категории",
        link: '/categories',
        icon: 'menu-i-category'
    },
    {
        id: 'company',
        title: "Компании",
        link: '/companies',
        icon: 'menu-i-list'
    },
    {
        id: 'popular-queries',
        title: "Популярный запросы",
        link: '/popular-queries',
        icon: 'menu-i-list'
    },
    {
        id: 'banner',
        title: "Баннеры",
        link: '/banner',
        icon: 'menu-i-list'
    },
    {
        id: 'users',
        title: "Контрагент",
        link: '/users/company-admins',
        icon: 'menu-i-list'
    }
]
const contentManagerRoutes = [
    {
        id: 'dishes',
        title: "Еды",
        link: '/dishes',
        icon: 'menu-i-list'
    },
    {
        id: 'menus',
        title: "Меню",
        link: '/menus',
        icon: 'menu-i-list'
    },
    {
        id: 'places',
        title: "Место",
        link: '/places',
        icon: 'menu-i-list'
    },
    {
        id: 'tables',
        title: "Столы",
        link: '/tables',
        icon: 'menu-i-list'
    },
    {
        id: 'users',
        title: "Пользователи",
        icon: 'menu-i-list',
        submenu: [
            {id: 'manager-users', link: '/users/manager', title: "Менеджер"},
            {id: 'content-manager-users', link: '/users/content-manager', title: "Контент-менеджер"}
        ]
    }
]


const getMenu = role => {
    switch (role) {
        case 'admin':
            return adminMenus;
        case 'company':
            return contentManagerRoutes;
        default:
            return []
    }
};

export default getMenu;
