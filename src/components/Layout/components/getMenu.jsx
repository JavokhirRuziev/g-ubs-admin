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
        id: 'users',
        title: "Пользователи",
        icon: 'menu-i-list',
        submenu: [
            {id: 'manager-users', link: '/users/manager', title: "Менеджер"},
            {id: 'content-manager-users', link: '/users/content-manager', title: "Контент-менеджер"}
        ]
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
        icon: 'menu-i-category'
    },
    {
        id: 'place',
        title: "Место",
        link: '/places',
        icon: 'menu-i-category'
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
