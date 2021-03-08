import React from 'react';

import {useTranslation} from "react-i18next";
import {useSelector} from 'react-redux'

import { Breadcrumb } from "components";
import { Menu, Dropdown, Button } from "antd";
import defaultAvatar from "assets/images/icons/user.svg";
import {Link} from "react-router-dom";

const Header = () => {

    const currentLangCode = useSelector(state => state.system.currentLangCode);
    const {t} = useTranslation();

    const menu = (
      <Menu>
          <Menu.Item>
              <Link to={`/posts/create?lang=${currentLangCode}`}>
                  {t('Посты')}
              </Link>
          </Menu.Item>
          <Menu.Item>
              <Link to={`/pages/create?lang=${currentLangCode}`}>
                  {t('Страницы')}
              </Link>
          </Menu.Item>
      </Menu>
    );

    return (
        <div className="m-header">
            <div className="m-header-wrapper">
                <div className="d-flex align-items-center">
                    <Breadcrumb
                      className="mb-0 bb-breadcrumb--outline"
                    />
                    <Dropdown overlay={menu}>
                        <Button>+ {t('Новый')}</Button>
                    </Dropdown>
                </div>
                <div className="d-flex align-items-center">
                    <div className="profile-dropdown cm-dropdown">
                        <div className="profile-dropdown-avatar">
                            <img src={defaultAvatar} alt=""/>
                        </div>
                        <div className="cm-dropdown-list-wrapper">
                            <div className="cm-dropdown-list">
                                <Link to={"/profile"} className="cm-dropdown-item">{t('Профил')}</Link>
                                <Link to={"/logout"} className="cm-dropdown-item">{t('Выход')}</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
