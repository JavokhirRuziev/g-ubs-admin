import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './components/Form';

import {useTranslation} from "react-i18next";
import qs from "query-string";
// import moment from "moment";

const Create = ({location, history}) => {
  const {t} = useTranslation();

  const query = qs.parse(location.search);
  const {lang} = query;

  return (
    <EntityForm.Main
      method="post"
      entity="document"
      name={`documents-${lang}`}
      url="/documents"
      prependData
      primaryKey="id"
      normalizeData={data => data}
      onSuccess={(data, resetForm) => {
        resetForm();
        history.push(`/documents/update/${data.id}?lang=${lang}`)
      }}
      fields={[
        {
          name: "name",
          required: true
        },
        {
          name: "category_id",
          onSubmitValue: value => value ? value.id : null
        },
        {
          name: "files",
          value: [],
          onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
        },
        {
          name: "status",
          value: true,
          onSubmitValue: value => value ? 1 : 0
        },
        // {
        //   name: "date_of_adoption",
        //   onSubmitValue: value => (!!value ? moment(value).unix() : ""),
        // }
      ]}
      params={{
        include: "translations, files",
        extra: {_l: lang}
      }}
    >
      {({isSubmitting, values, setFieldValue}) => {
        return (
          <Spin spinning={isSubmitting}>
            <div className="title-md mb-20 mt-14">{t('Создать документ')}</div>

            <Form {...{values, lang, setFieldValue}}/>

          </Spin>
        );
      }}
    </EntityForm.Main>
  );
};

export default Create;