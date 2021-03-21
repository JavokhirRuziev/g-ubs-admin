import React, {useState} from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './components/Form';

import {useTranslation} from "react-i18next";
import qs from "query-string";
import get from "lodash/get";

const Create = ({location, history}) => {
  const {t} = useTranslation();

  const query = qs.parse(location.search);
  const {lang} = query;
  const [saveType, setSaveType] = useState('list');

  return (
    <EntityForm.Main
      method="post"
      entity="advertising"
      name={`advertising-${lang}`}
      url="/advertising"
      prependData
      primaryKey="id"
      normalizeData={data => data}
      onSuccess={(data, resetForm) => {
        resetForm();
        if(saveType === 'list'){
          history.push(`/ad-support?lang=${lang}`)
        }else if(saveType === 'update'){
          history.push(`/ad-support/update/${get(data, 'id')}?lang=${lang}`)
        }else if(saveType === 'create'){
          history.push(`/ad-support/create?lang=${lang}`)
        }
      }}
      fields={[
        {
          name: "title",
          required: true
        },
        {
          name: "description"
        },
        {
          name: "sort"
        },
        {
          name: "file",
          value: [],
          onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(","),
        },
        {
          name: "status",
          value: true,
          onSubmitValue: value => value ? 1 : 0
        }
      ]}
      params={{
        extra: {_l: lang}
      }}
    >
      {({isSubmitting, values, setFieldValue}) => {
        return (
          <Spin spinning={isSubmitting}>
            <div className="title-md mb-20 mt-14">{t('Создать рекламный блок')}</div>

            <Form {...{values, lang, setFieldValue, setSaveType}}/>

          </Spin>
        );
      }}
    </EntityForm.Main>
  );
};

export default Create;