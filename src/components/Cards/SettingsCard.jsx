import React from 'react';
import PropTypes from "prop-types";
import {Button} from "antd";
import {useTranslation} from "react-i18next";

const SettingsCard = ({title, count, color, icon, handleClick, cardClick, classNames}) => {
    const {t} = useTranslation();
    return (
        <div className={`setting-card ${classNames}`}>
            <div className="setting-card__wrapper" onClick={cardClick}>
                <span className="setting-card__title">{title}</span>
                {count && <span className="setting-card__count">{count} {t("элементов")}</span>}
                <div className="setting-card__icon" style={{backgroundColor: color}}>
                    <img src={icon} alt=""/>
                </div>
            </div>
            <Button
                className='setting-card__btn'
                type="primary"
                size="large"
                onClick={handleClick}
            >
                {t("Добавить Элемент")}
            </Button>
        </div>
    );
};

SettingsCard.propTypes = {
    classNames: PropTypes.string,
    title: PropTypes.string,
    count: PropTypes.number,
    color: PropTypes.string,
    icon: PropTypes.string,
    handleClick: PropTypes.func,
    cardClick: PropTypes.func,
};
SettingsCard.defaultProps = {
    classNames: '',
    title: '',
    color: '#e8ebee',
    handleClick: () => {
    },
    cardClick: () => {
    }
};

export default SettingsCard;
