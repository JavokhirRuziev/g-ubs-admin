import React from 'react';

import {useTranslation} from "react-i18next";
import i18next from 'i18next';
import {useSelector, useDispatch} from 'react-redux'

import { Breadcrumb } from "components";
import { Menu, Dropdown, Button } from "antd";
import defaultAvatar from "assets/images/icons/user.svg";
import config from "config";
import systemActions from "store/actions/system";
import {Link} from "react-router-dom";

const Header = () => {

    const currentLangCode = useSelector(state => state.system.currentLangCode);
    const dispatch = useDispatch();
    const currentLangTitle = config.API_LANGUAGES.find(l => l.code === currentLangCode).title;

    const {t} = useTranslation();
    const changeLang = langCode => {
        i18next.changeLanguage(langCode);
        dispatch(systemActions.ChangeLanguage(langCode))
    };

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
                    <div className="cm-dropdown">
                        <div className="cm-dropdown-label">{t(currentLangTitle)}</div>
                        <div className="cm-dropdown-list-wrapper">
                            <div className="cm-dropdown-list">
                                {config.API_LANGUAGES.map(lang => (
                                    <span
                                        className="cm-dropdown-item"
                                        key={lang.id}
                                        onClick={() => changeLang(lang.code)}
                                    >
                                        {t(lang.title)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
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
