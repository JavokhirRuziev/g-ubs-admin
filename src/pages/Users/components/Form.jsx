import React from 'react';

import {Fields} from "components";
import {Field} from "formik";
import {Button, Switch} from "antd";
import {useTranslation} from "react-i18next";

const Form = ({isUpdate, setFieldValue, values}) => {
  const {t} = useTranslation();
  return (
    <div>
      <div className="title-md fs-16 mb-20">{isUpdate ? t('Изменение пользователья') : t('Добавление пользователя')}</div>
      <Field
        component={Fields.AntInput}
        name="username"
        type="text"
        placeholder={t("Введите логин")}
        size="large"
      />
      <Field
        component={Fields.AntInput}
        name="password"
        type="password"
        placeholder={t("Введите пароль")}
        size="large"
      />

      <div className="d-flex align-items-center mb-20 mt-20">
        <Switch
          onChange={value => {
            setFieldValue('status', value)
          }}
          checked={values.status}
        />
        <div className="ant-label mb-0 ml-10">{t('Активный статус')}</div>
      </div>

      <Button
        type="primary"
        size="large"
        className="fs-14 fw-300"
        htmlType="submit"
      >{isUpdate ? t("Сохранить") : t("Добавить")}</Button>
    </div>
  );
};

export default Form;