const adminMenus = [
    {
        id: 'dashboard',
        title: "Dashboard",
        link: '/dashboard',
        icon: 'menu-i-dashboard'
    },
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
        icon: 'menu-i-embassy'
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
        id: 'reviews',
        title: "Отзывы",
        link: '/reviews',
        icon: 'menu-i-list'
    },
    {
        id: 'users',
        title: "Контрагент",
        link: '/users/company-admins',
        icon: 'menu-i-list'
    },
    {
        id: 'faq',
        title: "FAQ",
        link: '/faq',
        icon: 'menu-i-list'
    },
    {
        id: 'notification',
        title: "Уведомление",
        link: '/notification',
        icon: 'menu-i-list'
    },
    {
        id: 'settings',
        title: "Настройки",
        link: '/settings',
        icon: 'menu-i-setting'
    },
    {
        id: 'unit',
        title: "Ед. изм",
        link: '/units',
        icon: 'menu-i-category'
    },
]
const contentManagerRoutes = [
    {
        id: 'orders',
        title: "Заказы",
        link: '/orders',
        icon: 'menu-i-dashboard'
    },
    {
        id: 'monitoring',
        title: "Мониторинг",
        link: '/monitoring',
        icon: 'menu-i-dashboard'
    },
    {
        id: 'monitoringWaiter',
        title: "Мониторинг официант",
        link: '/monitoring-waiter',
        icon: 'menu-i-dashboard'
    },
    {
        id: 'dishes',
        title: "Еды",
        link: '/dishes',
        icon: 'menu-i-dashboard'
    },
    {
        id: 'menus',
        title: "Меню",
        link: '/menus',
        icon: 'menu-i-file'
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
        icon: 'menu-i-user',
        submenu: [
            {id: 'waiter-users', link: '/users/waiter', title: "Официант"},
            {id: 'kitchener-users', link: '/users/kitchener', title: "Повор"},
            {id: 'manager-users', link: '/users/manager', title: "Менеджер"}
        ]
    },
    {
        id: 'profile',
        title: "Профиль компании",
        link: '/profile/company',
        icon: 'menu-i-dashboard'
    },
    {
        id: 'printers',
        title: "Принтеры",
        link: '/printers',
        icon: 'menu-i-dashboard'
    },
    {
        id: 'expenses',
        title: "Расходы",
        link: '/expenses',
        icon: 'menu-i-dashboard'
    },
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
