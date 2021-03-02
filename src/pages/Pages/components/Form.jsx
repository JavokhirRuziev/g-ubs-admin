import React from 'react';

import {Fields, GridElements, Panel, Ckeditor} from "components";
import {Field} from "formik";
import {Button, Switch} from "antd";

import {useTranslation} from "react-i18next";
import {ReactComponent as PlusIcon} from "assets/images/icons/plus.svg";
import {useHistory} from "react-router";

const Form = ({isUpdate, lang, setFieldValue, values, setSaveType}) => {

  const history = useHistory();
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
          />
          <Field
            component={Ckeditor}
            name="content"
            placeholder={t("Полный текст новости")}
            label={t("Полный текст новости")}
          />
        </Panel>
      </GridElements.Column>
      <GridElements.Column xs={4} gutter={10}>
        <Panel>

          <Field
            component={Fields.AsyncSelect}
            name="doc_id"
            placeholder={t("Виберите документ")}
            label={t("Документы")}
            isClearable
            loadOptionsUrl="/documents"
            className="mb-24"
            optionLabel="name"
            isMulti
            loadOptionsParams={() => {
              return {
                extra: {_l: lang}
              }
            }}
          />

          {/*<Field*/}
          {/*  component={Fields.AsyncSelect}*/}
          {/*  name="embassy_id"*/}
          {/*  placeholder={"Виберите посольство"}*/}
          {/*  label={"Посольство "}*/}
          {/*  isClearable*/}
          {/*  loadOptionsUrl="/embassy"*/}
          {/*  className="mb-24"*/}
          {/*  optionLabel="name"*/}
          {/*  isMulti*/}
          {/*  loadOptionsParams={() => {*/}
          {/*    return {*/}
          {/*      extra: {_l: lang}*/}
          {/*    }*/}
          {/*  }}*/}
          {/*/>*/}

          <Field
            component={Fields.UploadImageManager}
            name="files"
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
              onClick={() => history.push(`/pages?lang=${lang}`)}
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