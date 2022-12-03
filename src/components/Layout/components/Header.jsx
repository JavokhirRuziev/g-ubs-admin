import React from 'react';

import {useTranslation} from "react-i18next";
import i18next from 'i18next';
import { Breadcrumb } from "components";
import defaultAvatar from "assets/images/icons/user.svg";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import config from "config";
import systemActions from "store/actions/system";



const Header = () => {
    const currentLangCode = useSelector(state => state.system.currentLangCode);
    const currentLangTitle = config.API_LANGUAGES.find(l => l.code === currentLangCode).title;
    const dispatch = useDispatch();

    const {t} = useTranslation();
    const changeLang = langCode => {
        i18next.changeLanguage(langCode);
        dispatch(systemActions.ChangeLanguage(langCode))
    };

    return (
        <div className="m-header">
            <div className="m-header-wrapper">
                <div className="d-flex align-items-center">
                    <Breadcrumb
                        className="mb-0 bb-breadcrumb--outline"
                    />
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
