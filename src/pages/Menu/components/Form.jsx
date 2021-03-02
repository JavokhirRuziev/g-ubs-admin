import React from 'react';

import {Fields} from "components";
import {Field} from "formik";
import {Button} from "antd";
import { useTranslation } from 'react-i18next'

const Form = ({isUpdate}) => {
    const { t } = useTranslation();
  return (
    <div>
      <div className="title-md fs-16 mb-20">{isUpdate ? t('Изменить меню') : t('Новый меню')}</div>
      <Field
        component={Fields.AntInput}
        name="title"
        type="text"
        label={t("Введите заголовок")}
        placeholder={t("Введите заголовок")}
        size="large"
      />
      <Field
        component={Fields.AntInput}
        name="alias"
        type="text"
        label={t("Введите алиас")}
        placeholder={t("Введите алиас")}
        size="large"
      />
      <Button
        type="primary"
        size="large"
        className="fs-14 fw-300"
        htmlType="submit"
      >{isUpdate ? t("Сохранить меню") : t("Добавить меню")}</Button>
    </div>
  );
};

export default Form;