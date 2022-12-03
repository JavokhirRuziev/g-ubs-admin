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
      entity="company"
      name={`all-${lang}`}
      url="/companies"
      prependData
      primaryKey="id"
      normalizeData={data => data}
      onSuccess={(data, resetForm) => {
        resetForm();
        history.push(`/companies/update/${data.id}?lang=${lang}`)
      }}
      fields={[
        {
          name: "tip",
          value: 0,
          type: 'number',
          required: true
        },
        {
          name: "file_id",
          value: [],
          required: true,
          onSubmitValue: value => value.length > 0 && value[0].id
        },
        {
          name: "gallery",
          value: [],
          required: true,
          onSubmitValue: value => value.length > 0 && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
        },
        {
          name: "latitude",
          value: '41.345570',
          onSubmitValue: value => value && String(value)
        },
        {
          name: "longitude",
          value: '69.284599',
          onSubmitValue: value => value && String(value)
        },
        {
          name: "status",
          value: true,
          onSubmitValue: value => value ? 1 : 0
        },
        {
          name: "name",
          required: true
        },
        {
          name: "address",
          required: true
        },
        {
          name: "working_times",
        },
        {
          name: "description",
          required: true
        }
      ]}
      params={{
        extra: {_l: lang}
      }}
    >
      {({isSubmitting, values, setFieldValue}) => {
        return (
          <Spin spinning={isSubmitting}>
            <div className="title-md mb-20 mt-14">{t('Добавить компанию')}</div>

            <Form {...{values, lang, setFieldValue}}/>

          </Spin>
        );
      }}
    </EntityForm.Main>
  );
};

export default Create;