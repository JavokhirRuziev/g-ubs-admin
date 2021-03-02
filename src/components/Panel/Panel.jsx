import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './style.scss';

const Panel = ({children, className}) => {
  const classNames = cx(
    'bb-panel',
    className,
  );
  return (
    <div className={classNames}>{children}</div>
  );
};

Panel.propTypes = {
    className: PropTypes.string
};
Panel.defaultProps = {
    className: ''
};

export default Panel;