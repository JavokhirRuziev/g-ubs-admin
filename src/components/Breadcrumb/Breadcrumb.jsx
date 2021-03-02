import React from 'react';

import PropTypes from 'prop-types';
import cx from 'classnames';
import {Link, useHistory} from "react-router-dom";

import './style.scss';

const Breadcrumb = ({hasPrevBtn, list, className}) => {
  const classNames = cx(
    'bb-breadcrumb',
    className,
  );
  let history = useHistory();
  return (
    <div className={classNames}>
      {hasPrevBtn && <div className="bb-breadcrumb__prev-btn" onClick={() => history.goBack()}/>}
      {list.length > 0 && (
        <div className="bb-breadcrumb__list">
          {list.map((item, i) => (
            <div className="bb-breadcrumb__item" key={i}>
              {item.link ? (
                <Link to={item.link}>{item.text}</Link>
              ) : (
                <span>{item.text}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

Breadcrumb.propTypes = {
  hasPrevBtn: PropTypes.bool,
  list: PropTypes.array
};
Breadcrumb.defaultProps = {
  className: '',
  hasPrevBtn: true,
  list: []
};

export default Breadcrumb;