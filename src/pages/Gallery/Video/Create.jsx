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
      entity="gallery"
      name={`galleryPhoto-${lang}`}
      url="/gallery"
      prependData
      primaryKey="id"
      normalizeData={data => data}
      onSuccess={(data, resetForm) => {
        resetForm();
        if(saveType === 'list'){
          history.push(`/gallery/photo`)
        }else if(saveType === 'update'){
          history.push(`/gallery/photo/update/${get(data, 'id')}`)
        }else if(saveType === 'create'){
          history.push(`/gallery/photo/create`)
        }
      }}
      fields={[
        {
          name: "title_uz",
          required: true
        },
        {
          name: "title_ru",
          required: true
        },
        {
          name: "title_en",
          required: true
        },
        {
          name: "files",
          value: [],
          onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], [])
        },
        {
          name: "status",
          value: true,
          onSubmitValue: value => value ? 1 : 0
        },
        {
          name: 'type',
          value: 1
        }
      ]}
      params={{
        extra: {_l: lang}
      }}
    >
      {({isSubmitting, values, setFieldValue}) => {
        return (
          <Spin spinning={isSubmitting}>
            <div className="title-md mb-20 mt-14">{t('Создать фотогалерея')}</div>

            <Form {...{values, setFieldValue, setSaveType}}/>

          </Spin>
        );
      }}
    </EntityForm.Main>
  );
};

export default Create;
