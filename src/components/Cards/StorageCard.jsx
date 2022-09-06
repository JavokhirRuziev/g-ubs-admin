import React from 'react';
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";

const StorageCard = ({className, circleColor, title, count, onClick}) => {
  const {t} = useTranslation();
  return (
    <div className={`storage-card ${className}`} onClick={onClick}>
      <div className={`storage-card__count ${circleColor}`}>
        <div className="storage-card__count-text">{count} {t("шт")}</div>
      </div>
      <div className='storage-card__title'>{title}</div>
    </div>
  );
};

StorageCard.propTypes = {
  circleColor: PropTypes.oneOf(['marigold', 'dark-sky-blue', 'pale-lime', 'steel']),
  className: PropTypes.string,
  title: PropTypes.string,
  count: PropTypes.number,
  onClick: PropTypes.func,
};
StorageCard.defaultProps = {
  className: '',
  title: '',
  count: 0,
  circleColor: 'steel',
  onClick: () => {}
};

export default StorageCard;
