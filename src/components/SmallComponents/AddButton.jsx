import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const AddButton = ({title, className, handleClick, uppercase}) => {
  const classNames = cx(
    'bb-add-button',
    uppercase && 'text-uppercase',
    className,
  );
  return (
    <div className={classNames} onClick={handleClick}>{title}</div>
  );
};

AddButton.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func,
};
AddButton.defaultProps = {
  className: '',
  title: 'Add',
  handleClick: () => {}
};

export default AddButton;