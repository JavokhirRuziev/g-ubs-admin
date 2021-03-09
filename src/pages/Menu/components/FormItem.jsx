import React from 'react';

import {Fields} from "components";
import {Field} from "formik";
import {Button} from "antd";
import { useTranslation } from 'react-i18next'

const FormItem = ({isUpdate}) => {
    const { t } = useTranslation();
  return (
    <div>
      <div className="title-md fs-16 mb-20">{isUpdate ? t('Изменить подменю') : t('Новый подменю')}</div>
      <Field
        component={Fields.AntInput}
        name="title"
        type="text"
        label={t("Заголовок")}
        placeholder={t("Введите заголовок")}
        size="large"
      />
      <Field
        component={Fields.AntInput}
        name="url"
        type="text"
        label={t("Ссылка")}
        placeholder={t("Введите ссылку")}
        size="large"
      />
      <Button
        type="primary"
        size="large"
        className="fs-14 fw-300"
        htmlType="submit"
      >{isUpdate ? t("Сохранить подменю") : t("Добавить подменю")}</Button>
    </div>
  );
};

export default FormItem;