import React, { useEffect } from 'react';

import {Fields, GridElements, Panel} from "components";
import {Field} from "formik";
import {Button, Switch} from "antd";

import {useTranslation} from "react-i18next";
import get from 'lodash/get'
import {ReactComponent as PlusIcon} from "assets/images/icons/plus.svg";
import {useHistory} from "react-router";

const Form = ({setFieldValue, values, tabLang, setSaveType}) => {

  const history = useHistory();
  const {t} = useTranslation();

  useEffect(()=> {

    let fields = get(values, 'full_locations', '').split(',');
    let lat = fields[0];
    let long = fields[1];

    if (lat){
      setFieldValue("lat", `${lat}`);
    }
    if (long){
      setFieldValue("long", `${long}`);
    }

  }, [get(values, 'full_locations')])

  return (
    <GridElements.Row gutter={10} className={"mb-30"}>
      <GridElements.Column xs={8} gutter={10}>
        <Panel>
          <Field
            component={Fields.AntInput}
            name={`title_${tabLang}`}
            type="text"
            placeholder={t("Введите ")}
            label={t(`Названия (${tabLang})`)}
            size="large"
          />
          <Field
            component={Fields.AntInput}
            name={`address_${tabLang}`}
            type="text"
            placeholder={t("Введите Адрес")}
            label={t(`Адрес (${tabLang})`)}
            size="large"
          />
          <Field
            component={Fields.AntInput}
            name={`destination_${tabLang}`}
            type="text"
            placeholder={t("Введите ")}
            label={t(`Ориентир (${tabLang})`)}
            size="large"
            rows={6}
          />

          <Field
              component={Fields.AntInput}
              name={`full_locations`}
              placeholder={t("Введите локации ")}
              label={t(`Локации`)}
              size="large"
              type="text"
              rows={6}
          />

          <Field
            component={Fields.Map}
            {...{values, setFieldValue}}
          />

        </Panel>
      </GridElements.Column>
      <GridElements.Column xs={4} gutter={10}>
        <Panel>
          <Field
              component={Fields.AntInput}
              name="phone"
              type="text"
              placeholder={t("Введите Телефон")}
              label={t("Телефон")}
              size="large"
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
          <div className="buttons-wrap">
            <Button
                type="primary"
                size="large"
                className="fs-14 fw-300"
                htmlType="submit"
                onClick={() => setSaveType('list')}
            >{t("Сохранить")}</Button>

            <Button
                type="ghost"
                size="large"
                className="fs-14 fw-300"
                htmlType="submit"
                onClick={() => setSaveType('update')}
            >{t("Применить")}</Button>

            <Button
                type="ghost"
                size="large"
                className="fs-14 fw-300"
                htmlType="button"
                onClick={() => history.push(`/locations`)}
            >{t("Отменить")}</Button>

            <Button
                type="ghost"
                size="large"
                className="fs-14 fw-300 btn-with-icon"
                htmlType="submit"
                onClick={() => setSaveType('create')}
            ><PlusIcon/> {t("Сохранить и добавить")}</Button>

          </div>
        </Panel>
      </GridElements.Column>
    </GridElements.Row>
  );
};

export default Form;