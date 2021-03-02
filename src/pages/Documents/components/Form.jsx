import React from 'react';

import {Fields, GridElements, Panel} from "components";
import {Field} from "formik";
import {Button, Switch} from "antd";

import {useTranslation} from "react-i18next";

const Form = ({isUpdate, lang, setFieldValue, values}) => {

  const {t} = useTranslation();

  return (
    <GridElements.Row gutter={10} className={"mb-30"}>
      <GridElements.Column xs={8} gutter={10}>
        <Panel>
          <Field
            component={Fields.AntInput}
            name="name"
            type="text"
            placeholder={t("Введите названия")}
            label={t("Названия")}
            size="large"
          />
          <Field
            component={Fields.UploadImageManager}
            name="files"
            label={t("Прикрепление файлов")}
            size="large"
            className={"mb-0"}
            limit={10}
            isDocument
            isMulti
          />
        </Panel>
      </GridElements.Column>
      <GridElements.Column xs={4} gutter={10}>
        <Panel>

          <Field
            component={Fields.AsyncSelect}
            name="category_id"
            placeholder={t("Виберите категорию")}
            label={t("Категория")}
            isClearable
            loadOptionsUrl="/categories"
            className="mb-24"
            optionLabel={`name_${lang}`}
            loadOptionsParams={() => {
              return {
                extra: {_l: lang},
                filter: { type: 'document'}
              }
            }}
          />

          <div className="d-flex align-items-center mb-24">
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
          >{isUpdate ? t("Сохранить") : t("Создать")}</Button>
        </Panel>
      </GridElements.Column>
    </GridElements.Row>
  );
};

export default Form;