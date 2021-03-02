import React, {useState} from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import EntityContainer from 'modules/entity/containers';
import Form from './components/Form';

import {useTranslation} from "react-i18next";
import get from "lodash/get";

const Update = ({location, history, match}) => {
  const {t} = useTranslation();

  const {id} = match.params;
  const [saveType, setSaveType] = useState('list');

  return (
    <EntityContainer.One
      entity="gallery"
      name={`gallery-${id}`}
      url={`/gallery/${id}`}
      primaryKey="id"
      id={id}
      params={{
        include: "translations, files",
      }}
    >
      {({item, isFetched}) => {
        return (
          <Spin spinning={!isFetched}>
            <div className="title-md mb-20 mt-14">{t('Изменить галерию')}</div>

            <EntityForm.Main
              method={'put'}
              entity="gallery"
              name={`gallery`}
              url={`/gallery/${get(item, 'id')}`}
              updateData={true}
              primaryKey="id"
              normalizeData={data => data}
              onSuccess={(data, resetForm) => {
                resetForm();
                if(saveType === 'list'){
                  history.push(`/gallery`)
                }else if(saveType === 'update'){
                  history.push(`/gallery/update/${get(data, 'id')}`)
                }else if(saveType === 'create'){
                  history.push(`/gallery/create`)
                }
              }}
              fields={[
                {
                  name: "title_uz",
                  required: true,
                  value: get(item, 'title_uz')
                },
                {
                  name: "title_ru",
                  required: true,
                  value: get(item, 'title_ru')
                },
                {
                  name: "title_en",
                  required: true,
                  value: get(item, 'title_en')
                },
                {
                  name: "files",
                  value: get(item, 'files') ?  get(item, 'files', []) : [],
                  onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], [])
                },
                {
                  name: "status",
                  value: get(item, 'status') === 1,
                  onSubmitValue: value => value ? 1 : 0
                }
              ]}
              params={{
                include: ['files'],
              }}
            >
              {({isSubmitting, values, setFieldValue}) => {
                return (
                  <Spin spinning={isSubmitting}>

                    <Form {...{values, setFieldValue, isUpdate: true, setSaveType}}/>

                  </Spin>
                );
              }}
            </EntityForm.Main>

          </Spin>
        )
      }}
    </EntityContainer.One>
  );
};

export default Update;
