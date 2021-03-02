import React from 'react';
import PropTypes from "prop-types";
import cx from "classnames";

const NavigationHelper = ({text, className, icon}) => {
  const classNames = cx(
    'fw-500 flex-cen',
    className,
  );
  return (
    <div className={classNames}>
      <div className="flex-cen  flex-column">
        <div className={`bb-icon ${icon}-icon`}/>
        <div>{text}</div>
      </div>
    </div>
  );
};

NavigationHelper.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
  icon: PropTypes.oneOf(["empty", "reply"])
};
NavigationHelper.defaultProps = {
  className: '',
  icon: 'empty',
  text: 'Нет данных'
};

export default NavigationHelper;