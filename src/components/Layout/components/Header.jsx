import React from 'react';

import {useTranslation} from "react-i18next";
import { Breadcrumb } from "components";
import defaultAvatar from "assets/images/icons/user.svg";
import {Link} from "react-router-dom";

const Header = () => {
    const {t} = useTranslation("");

    return (
        <div className="m-header">
            <div className="m-header-wrapper">
                <div className="d-flex align-items-center">
                    <Breadcrumb
                      className="mb-0 bb-breadcrumb--outline"
                    />
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
