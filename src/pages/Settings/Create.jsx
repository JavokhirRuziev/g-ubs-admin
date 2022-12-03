import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './components/Form';

import {useTranslation} from "react-i18next";
import qs from "query-string";

const Create = ({location, history}) => {
  const {t} = useTranslation("main");

  const query = qs.parse(location.search);
  const {lang} = query;

  return (
    <EntityForm.Main
      method="post"
      entity="setting"
      name={`settings-${lang}`}
      url="/settings"
      prependData
      primaryKey="id"
      normalizeData={data => data}
      onSuccess={(data, resetForm) => {
        resetForm();
        history.push(`/settings/update/${data.id}?lang=${lang}`)
      }}
      fields={[
        {
          name: "name",
          required: true
        },
        {
          name: "value",
          value: ""
        },
        {
          name: "link"
        },
        {
          name: "slug",
          value: "",
          onSubmitValue: value => value ? value : null
        },
        {
          name: "alias"
        },
        {
          name: "photo",
          value: [],
          onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
        },
        {
          name: "status",
          value: true,
          onSubmitValue: value => value ? 1 : 0
        }
      ]}
      params={{
        include: "files",
        extra: {_l: lang}
      }}
    >
      {({isSubmitting, values, setFieldValue}) => {
        return (
          <Spin spinning={isSubmitting}>
            <div className="title-md mb-20 mt-14">{t('Создать настройки')}</div>

            <Form {...{values, lang, setFieldValue}}/>

          </Spin>
        );
      }}
    </EntityForm.Main>
  );
};

export default Create;