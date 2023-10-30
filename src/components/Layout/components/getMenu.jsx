const adminMenus = [
	{
		id: "dashboard",
		title: "Dashboard",
		link: "/dashboard",
		icon: "menu-i-dashboard"
	},
	{
		id: "category",
		title: "Категории",
		link: "/categories",
		icon: "menu-i-category"
	},
	{
		id: "company",
		title: "Компании",
		link: "/companies",
		icon: "menu-i-embassy"
	},
	{
		id: "popular-queries",
		title: "Популярный запросы",
		link: "/popular-queries",
		icon: "menu-i-list"
	},
	{
		id: "banner",
		title: "Баннеры",
		link: "/banner",
		icon: "menu-i-list"
	},
	{
		id: "reviews",
		title: "Отзывы",
		link: "/reviews",
		icon: "menu-i-list"
	},
	{
		id: "users",
		title: "Контрагент",
		link: "/users/company-admins",
		icon: "menu-i-list"
	},
	{
		id: "faq",
		title: "FAQ",
		link: "/faq",
		icon: "menu-i-list"
	},
	{
		id: "notification",
		title: "Уведомление",
		link: "/notification",
		icon: "menu-i-list"
	},
	{
		id: "settings",
		title: "Настройки",
		link: "/settings",
		icon: "menu-i-setting"
	},
	{
		id: "unit",
		title: "Ед изм",
		link: "/units",
		icon: "menu-i-category"
	}
];
const contentManagerRoutes = [
	{
		id: "statistics",
		link: "/statistics",
		title: "Главная",
		icon: "menu-i-category",
		role: "dashboard"
	},
	{
		id: "report",
		title: "Отчет",
		icon: "menu-i-dashboard",
		submenu: [
			{
				id: "orders",
				link: "/orders",
				title: "Отчёт по заказом",
				role: "monitoring_by_orders"
			},
			{
				id: "monitoring",
				link: "/orders-on-table",
				title: "Отчёт по районам",
				role: "monitoring_by_tables"
			},
			{
				id: "monitoring",
				link: "/monitoring",
				title: "Отчёт по товаром",
				role: "monitoring_by_dishes"
			},
			{
				id: "monitoringWaiter",
				link: "/monitoring-waiter",
				title: "Отчёт по агентам",
				role: "monitoring_by_waiters"
			},
			{
				id: "monitoring-deleted-dishes",
				link: "/deleted-dishes",
				title: "Удалёные",
				role: "deleted_dishes"
			}
		]
	},
	{
		id: "accountant",
		title: "Бухгалтерия",
		icon: "menu-i-dashboard",
		submenu: [
			{
				id: "expenses",
				title: "Расходы",
				link: "/expenses",
				role: "transactions"
			},
			{
				id: "incomes",
				title: "Приход",
				link: "/incomes",
				role: "transactions"
			},
			{
				id: "solved",
				title: "Снять деньги",
				link: "/solved",
				role: "transactions"
			},
			{
				id: "clients",
				title: "Клиенты",
				link: "/persons?type=clients",
				role: "customers"
			},
			{
				id: "employees",
				title: "Сотрудники",
				link: "/persons?type=employees",
				role: "employees"
			},
			{
				id: "counter_agents",
				title: "Контрагенты",
				link: "/persons?type=counter_agents",
				role: "contragents"
			}
		]
	},
	{
		id: "dishes",
		title: "Продукт",
		link: "/dishes",
		icon: "menu-i-dashboard",
		role: "dishes"
	},
	{
		id: "finished-dishes",
		title: "Готовый продукт",
		link: "/finished-dishes",
		icon: "menu-i-dashboard",
		role: "dishes"
	},
	{
		id: "menus",
		title: "Каталог",
		link: "/menus",
		icon: "menu-i-file",
		role: "menus"
	},
	{
		id: "places",
		title: "Область",
		link: "/places",
		icon: "menu-i-list",
		role: "places"
	},
	{
		id: "tables",
		title: "Район",
		link: "/tables",
		icon: "menu-i-list",
		role: "tables"
	},
	{
		id: "stock",
		title: "Склад",
		icon: "menu-i-stock",
		submenu: [
			{
				id: "stock-stock",
				link: "/stock/stock",
				title: "Склад",
				role: "stocks"
			},
			{
				id: "stock-product-categories",
				link: "/stock/product-categories",
				title: "Категория продуктов",
				role: "product_categories"
			},
			{
				id: "stock-products",
				link: "/stock/products",
				title: "Продукты",
				role: "products"
			},
			{
				id: "/stock/stock-brought-products/",
				link: "/stock/stock-brought-products/",
				title: "Привезенный товар",
				role: "brought_products"
			},
			{
				id: "/stock/stock-distributed-products/",
				link: "/stock/stock-distributed-products/",
				title: "Распределенный продукт",
				role: "distributed_products"
			}
			// {
			// 	id: "/finished-product/",
			// 	link: "/finished-product",
			// 	title: "Готовый продукт",
			// 	role: "dishes"
			// },
		]
	},
	{
		id: "users",
		title: "Пользователи",
		icon: "menu-i-user",
		submenu: [
			{
				id: "waiter-users",
				link: "/users/waiter",
				title: "Агент",
				role: "users"
			},
			{
				id: "kitchener-users",
				link: "/users/kitchener",
				title: "Инструктор",
				role: "users"
			},
			{
				id: "manager-users",
				link: "/users/manager",
				title: "Менеджер",
				role: "users"
			},
			{
				id: "purveyer-users",
				link: "/users/purveyer",
				title: "Поставщик",
				role: "users"
			}
		]
	},
	{
		id: "profile",
		title: "Профиль компании",
		link: "/profile/company",
		icon: "menu-i-dashboard",
		role: "company_profile"
	},
	{
		id: "printers",
		title: "Принтеры",
		link: "/printers",
		icon: "menu-i-dashboard",
		role: "printers"
	}
];

const getMenu = (role, profile) => {
	if (profile) {
		const filteredArr = contentManagerRoutes.filter(el => {
			if (el.submenu && Array.isArray(el.submenu)) {
				el.submenu = el.submenu.filter(e => {
					return profile && profile.some(p => p.role === e.role);
				});
				return el.submenu.length > 0;
			} else {
				return profile && profile.some(p => p.role === el.role);
			}
		});
		if (role !== "admin") {
			return filteredArr;
		}
		if (profile === null) {
			return [];
		}
		if (role === "admin") {
			return adminMenus;
		}
	} else {
		return [];
	}
};

export default getMenu;
