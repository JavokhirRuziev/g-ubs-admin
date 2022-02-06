import React, {useState} from 'react';
import {Link, useLocation} from "react-router-dom";
import getMenu from "./getMenu";
import get from "lodash/get";
import {useSelector} from "react-redux";

const Sidebar = ({isCollapsed, setCollapse}) => {
    const profile = useSelector(state => state.auth.data)
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
                        <span>{get(profile, 'success.name') !== "admin" ? get(profile, 'success.name') : 'Zim-Zim'} admin</span>
                    </a>
                    <div className="menu-collapse-btn" onClick={toggle}/>
                </div>

                <ul className="m-menu">
                    {getMenu(get(profile, 'success.role')).map((m, i) => {
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
