import React from 'react';

import {Fields} from "components";
import {Field} from "formik";
import {Button, Switch} from "antd";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";

const Form = ({isUpdate, setFieldValue, values}) => {
  const lang = useSelector(state => state.system.currentLangCode);
  const {t} = useTranslation();
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
        component={Fields.AsyncSelect}
        name="parent_id"
        placeholder={t("Виберите категория")}
        label={t("Подкатегория для")}
        isClearable
        loadOptionsUrl="/categories"
        className="mb-20"
        optionLabel={`name_${lang}`}
        filterParams={{
          type: "post"
        }}
      />

      <div className="row mb-20">
        <div className="col-md-4">
          <Field
            component={Fields.UploadImageManager}
            name="icon"
            label={t("Фото")}
            size="large"
          />
        </div>
        <div className="col-md-8">
          <div className="mt-25">
            <div className="d-flex align-items-center mb-24">
              <Switch
                onChange={value => {
                  setFieldValue('status', value)
                }}
                checked={values.status}
              />
              <div className="ant-label mb-0 ml-10">{t('Активный статус')}</div>
            </div>
            <div className="d-flex align-items-center mb-24">
              <Switch
                onChange={value => {
                  setFieldValue('top', value)
                }}
                checked={values.top}
              />
              <div className="ant-label mb-0 ml-10">{t('Сделать индивидуальное')}</div>
            </div>
          </div>
        </div>

      </div>

      <Button
        type="primary"
        size="large"
        className="fs-14 fw-300"
        htmlType="submit"
      >{isUpdate ? t("Сохранить категорию") : t("Добавить")}</Button>
    </div>
  );
};

export default Form;