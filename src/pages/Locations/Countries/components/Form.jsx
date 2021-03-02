import React from 'react';
import {useTranslation} from 'react-i18next'
import {Fields} from "components";
import {Field} from "formik";
import {Button} from "antd";

const Form = () => {
  const {t} = useTranslation();
  return (
    <div>
      <div className="title-md fs-16 mb-20">{t('Изменение')}</div>
      <Field
        component={Fields.AntInput}
        name="name"
        type="text"
        placeholder={t("Введите название")}
        size="large"
      />
      <Field
        component={Fields.AntInput}
        name="phone_code"
        type="number"
        placeholder={t("Введите международный телефонный код")}
        size="large"
      />
      <Field
        component={Fields.UploadImageManager}
        name="flag"
        label={t("Флаг")}
        size="large"
        className={"mb-10"}
      />
      <Field
        component={Fields.UploadImageManager}
        name="photo"
        label={t("Фото")}
        size="large"
        className={"mb-10"}
      />
      <Button
        type="primary"
        size="large"
        className="fs-14 fw-300"
        htmlType="submit"
      >{t("Сохранить")}</Button>
    </div>
  );
};

export default Form;