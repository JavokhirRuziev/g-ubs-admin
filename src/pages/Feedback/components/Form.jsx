import React from 'react';

import {Fields, GridElements, Panel} from "components";
import {Field} from "formik";
import {Button, Switch} from "antd";
import {useTranslation} from "react-i18next";

const Form = ({isUpdate, setFieldValue, values, isFetched}) => {
  const {t} = useTranslation();

  return (
    <GridElements.Row gutter={10} className={"mb-30"}>
      <GridElements.Column xs={12} gutter={10}>
        <Panel>
          <Field
            component={Fields.AntInput}
            name="name"
            type="text"
            placeholder={t("Имя")}
            label={t("Имя")}
            size="large"
            disabled
          />
          <Field
            component={Fields.AntInput}
            name="phone"
            type="text"
            placeholder={t("Телефон")}
            label={t("Телефон")}
            size="large"
            disabled
          />
          <Field
            component={Fields.AntInput}
            name="email"
            type="text"
            placeholder={t("Email")}
            label={t("Email")}
            size="large"
            disabled
          />
          <Field
            component={Fields.AntTextarea}
            name="text"
            type="text"
            placeholder={t("Сообщение")}
            label={t("Сообщение")}
            size="large"
            disabled
            rows={5}
          />
          <Field
            component={Fields.AntInput}
            name="type"
            type="text"
            placeholder={t("Тип")}
            label={t("Тип")}
            size="large"
            disabled
          />
          <div className="d-flex align-items-center mb-20">
            <Switch
              onChange={value => {
                setFieldValue('status', value)
              }}
              checked={values.status}
            />
            <div className="ant-label mb-0 ml-10">{t("Активный статус")}</div>
          </div>

          <Button
            type="primary"
            size="large"
            className="fs-14 fw-300"
            htmlType="submit"
          >{isUpdate ? t("Сохранить") : t("Добавить")}</Button>

        </Panel>
      </GridElements.Column>
    </GridElements.Row>
  );
};

export default Form;
