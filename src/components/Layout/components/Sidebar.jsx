import React, {useState} from 'react';
import {Link, useLocation} from "react-router-dom";
import {useTranslation} from "react-i18next";

const Sidebar = ({isCollapsed, setCollapse}) => {
    const {t} = useTranslation();
    const menu = [
        {
            id: 'product',
            title: t('Продукты'),
            link: '/products',
            icon: 'menu-i-page'
        },
        {
            id: 'posts',
            title: t('Посты'),
            icon: 'menu-i-category',
            submenu: [
                {id: 'post-news', title: "Новости", link: '/posts'},
                {id: 'post-blog', title: "Блоги", link: '/blogs'},
            ]
        },
        {
            id: 'gallery',
            title: t('Галерея'),
            icon: 'menu-i-category',
            submenu: [
                {id: 'gallery-photo', title: "Фото", link: '/gallery/photo'},
                {id: 'gallery-video', title: "Видео", link: '/gallery/video'},
            ]
        },
        {
            id: 'category',
            title: t('Категория'),
            icon: 'menu-i-category',
            submenu: [
                {id: 'category-posts', title: "Новости", link: '/categories/posts'},
                {id: 'category-blogs', title: "Блоги", link: '/categories/blogs'},
                {id: 'category-products', title: "Продукты", link: '/categories/products'},
            ]
        },
        {
            id: 'settings',
            title: t('Настройки'),
            icon: 'menu-i-setting',
            submenu: [
                {id: 'settings-menu', title: t('Меню'), link: '/menu'},
                {id: 'settings-others', title: t('Основные'), link: '/settings'},
                {id: 'settings-translation', title: t('Переводы'), link: '/translation'},
            ]
        },
        {id: 'pages', title: t('Страницы'), link: '/pages', icon: 'menu-i-page'},
        {id: 'partners', title: t('Партнеры'), link: '/partners', icon: 'menu-i-page'},
        {id: 'banners', title: t('Баннеры'), link: '/banners', icon: 'menu-i-page'},
        {id: 'shops', title: t('Локации'), link: '/locations', icon: 'menu-i-page'},
        {id: 'feedback', title: t('Обратная связь'), link: '/feedback', icon: 'menu-i-list'},
        {id: 'ad-support', title: t('Рекламная поддержка'), link: '/ad-support', icon: 'menu-i-list'}
    ];

    const [toggledSubmenu, setToggleSubmenu] = useState(null);

    const toggle = () => {
        if (isCollapsed) {
            setCollapse(false);
        } else setCollapse(true)
    };

    const location = useLocation();
    const currentPath = location.pathname.split('/')[1];
    const fullPath = location.pathname;

    const toggleSubmenu = id => {
        if (id === toggledSubmenu) {
            setToggleSubmenu(null);
        } else {
            setToggleSubmenu(id);
        }
    };

    return (
        <div className="m-sidebar">
            <div className="m-sidebar-wrapper">
                <div className="m-sidebar-head">
                    <a href="/" target="_blank" rel="noopener noreferrer" className="m-sidebar-logo">
                        <span>MS admin</span>
                    </a>
                    <div className="menu-collapse-btn" onClick={toggle}/>
                </div>

                <ul className="m-menu">
                    {menu.map((m, i) => {
                        if (m.submenu) {
                            return (
                                <li key={i}
                                    className={`has-submenu ${m.id === toggledSubmenu ? 'submenu-visible' : ''}`}>
                                    <div
                                        className={`m-menu-link ${('/' + currentPath) === m.link ? 'active-menu' : ''}`}
                                        onClick={() => toggleSubmenu(m.id)}>
                                        <div>
                                            <img src={require(`assets/images/base/${m.icon}.svg`)} alt=""/>
                                            <span>{m.title}</span>
                                            <span className="toggle-submenu"/>
                                        </div>
                                    </div>
                                    <div className="submenu">
                                        {m.submenu.map((sm, i) => (
                                            <Link key={i} to={sm.link}
                                                  className={fullPath === sm.link ? 'active' : ''}>{sm.title}</Link>
                                        ))}
                                    </div>
                                </li>
                            )
                        } else {
                            return (
                                <li key={i}>
                                    <Link to={m.link}
                                          className={`m-menu-link ${('/' + currentPath) === m.link ? 'active-menu' : ''}`}>
                                        <div>
                                            <img src={require(`assets/images/base/${m.icon}.svg`)} alt=""/>
                                            <span>{m.title}</span>
                                        </div>
                                    </Link>
                                </li>
                            )
                        }
                    })}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
