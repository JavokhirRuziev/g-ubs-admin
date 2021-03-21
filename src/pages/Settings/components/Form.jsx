import React from 'react';

import {Fields, GridElements, Panel} from "components";
import {Field} from "formik";
import {Button, Switch} from "antd";

import {useTranslation} from "react-i18next";

const Form = ({isUpdate, setFieldValue, values}) => {

  const {t} = useTranslation();

  return (
    <GridElements.Row gutter={10} className={"mb-30"}>
      <GridElements.Column xs={8} gutter={10}>
        <Panel>
          <Field
            component={Fields.AntInput}
            name="name"
            type="text"
            placeholder={t("Введите загаловок")}
            label={t("Заголовок")}
            size="large"
          />
          <Field
            component={Fields.AntInput}
            name="slug"
            type="text"
            placeholder={t("Введите слуг")}
            label={t("Слуг")}
            size="large"
            disabled={isUpdate}
          />
          <Field
            component={Fields.AntInput}
            name="link"
            type="text"
            placeholder={t("Введите линк")}
            label={t("Линк")}
            size="large"
          />
          <Field
            component={Fields.AntTextarea}
            name="value"
            type="text"
            rows={5}
            label={t("Текст")}
            placeholder={t("Введите текст")}
          />
        </Panel>
      </GridElements.Column>
      <GridElements.Column xs={4} gutter={10}>
        <Panel>
          <Field
            component={Fields.AntInput}
            name="alias"
            type="text"
            placeholder={t("Введите алиас")}
            label={t("Алиас")}
            size="large"
            disabled={isUpdate}
          />

          <Field
            component={Fields.UploadImageManager}
            name="photo"
            label={t("Фото")}
            size="large"
            className={"mb-14"}
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