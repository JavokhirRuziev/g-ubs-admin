import React from 'react';

import {Fields} from "components";
import {Field} from "formik";
import {Button, Switch} from "antd";
import { useTranslation } from 'react-i18next'

const FormItem = ({isUpdate, values, setFieldValue}) => {
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
      <Field
        component={Fields.AntInput}
        name="sort"
        type="number"
        label={t("Порядок")}
        placeholder={t("Введите порядок")}
        size="large"
      />
      <Field
        component={Fields.UploadImageManager}
        name="icon"
        label={t("Фото")}
        size="large"
        className={"mb-10"}
      />

      <div className="row mb-20">
        <div className="col-md-4">
          <div className="d-flex align-items-center">
            <Switch
              onChange={value => {
                setFieldValue('main_sub_menu', value);
                setFieldValue('secondary_sub_menu', false);
                setFieldValue('top_sub_menu', false);
              }}
              checked={values.main_sub_menu}
            />
            <div className="ant-label mb-0 ml-10">{t('Главный')}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="d-flex align-items-center">
            <Switch
              onChange={value => {
                setFieldValue('main_sub_menu', false);
                setFieldValue('secondary_sub_menu', value);
                setFieldValue('top_sub_menu', false);
              }}
              checked={values.secondary_sub_menu}
            />
            <div className="ant-label mb-0 ml-10">{t('Полезные')}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="d-flex align-items-center">
            <Switch
              onChange={value => {
                setFieldValue('main_sub_menu', false);
                setFieldValue('secondary_sub_menu', false);
                setFieldValue('top_sub_menu', value);
              }}
              checked={values.top_sub_menu}
            />
            <div className="ant-label mb-0 ml-10">{t('Топ')}</div>
          </div>
        </div>
      </div>

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