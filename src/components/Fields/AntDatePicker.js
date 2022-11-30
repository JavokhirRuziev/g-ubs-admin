import React  from "react";

import PropTypes from "prop-types";
import cx from 'classnames';
import {DatePicker} from 'antd';
import {useTranslation} from "react-i18next";

const AntDatePicker = ({ className, label, placeholder, onChange, disabled,  field, form: { touched, errors }, ...props }) => {
  const {t} = useTranslation("main");

  const classes = cx(
    'form-field ant-form-item',
    touched[field.name] && errors[field.name] && 'has-error',
    className
  );

  return (
      <div className={classes}>
        {label && (
          <label className="form-field__label ant-label">{label}</label>
        )}
        <DatePicker
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          value={field.value ? field.value : null}
          {...props}
        />
        {touched[field.name] && errors[field.name] && (
          <div className="form-field__error ant-form-explain">{t(errors[field.name])}</div>
        )}
      </div>
  );
};

AntDatePicker.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool
};

AntDatePicker.defaultProps = {
  label: "",
  placeholder: "",
  className: null,
  disabled: false
};

export default AntDatePicker;

