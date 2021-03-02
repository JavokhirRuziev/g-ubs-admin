import React from 'react';

import {Fields} from "components";
import {Field} from "formik";
import {Button} from "antd";
import { useTranslation } from 'react-i18next'

const Form = ({isUpdate}) => {
    const { t } = useTranslation();
  return (
    <div>
      <div className="title-md fs-16 mb-20">{isUpdate ? t('Изменение категорию') : t('Добавление категория')}</div>
      <Field
        component={Fields.AntInput}
        name="name_uz"
        type="text"
        placeholder={t("Введите название (UZ)")}
        size="large"
      />
      <Field
        component={Fields.AntInput}
        name="name_ru"
        type="text"
        placeholder={t("Введите название (RU)")}
        size="large"
      />
      <Field
        component={Fields.AntInput}
        name="name_en"
        type="text"
        placeholder={t("Введите название (EN)")}
        size="large"
      />
      <Field
        component={Fields.AntInput}
        name="slug"
        type="text"
        placeholder={t("Введите слуг")}
        size="large"
      />
      <Field
        component={Fields.AntInput}
        name="sort"
        type="number"
        placeholder={t("Введите сортировку")}
        size="large"
      />
      <Field
        component={Fields.AntSelect}
        name="type"
        optionLabel="label"
        optionValue="value"
        placeholder={t("Выберите типь")}
        size={'large'}
        selectOptions={[
          {name: t("По умолчанию"), value: 1},
          {name: t("Актуальный"), value: 2},
          {name: t("Топ"), value: 3},
        ]}
      />

      <Button
        type="primary"
        size="large"
        className="fs-14 fw-300"
        htmlType="submit"
      >{isUpdate ? t("Сохранить категорию") : t("Добавить категория")}</Button>
    </div>
  );
};

export default Form;