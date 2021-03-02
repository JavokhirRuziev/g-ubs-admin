import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './Form';
import get from "lodash/get";

const Update = ({selected, showUpdateModal}) => {
  return (
    <EntityForm.Main
      method="put"
      entity="category"
      name={`categoryUseful`}
      url={`/useful-links-category/${get(selected, 'id')}`}
      primaryKey="id"
      normalizeData={data => data}
      id={get(selected, 'id')}
      onSuccess={(data, resetForm) => {
        resetForm();
        showUpdateModal(false)
      }}
      fields={[
        {name: "name_ru", value: get(selected, 'name_ru')},
        {name: "name_uz", value: get(selected, 'name_uz')},
        {name: "name_en", value: get(selected, 'name_en')},
        {name: "slug", value: get(selected, 'slug')},
        {name: "sort", required: true, value: get(selected, 'sort'), onSubmitValue: value => Number(value)},
        {name: "type", required: true, value: get(selected, 'type')},
      ]}
      updateData
    >
      {({isSubmitting, values, setFieldValue}) => {
        return (
          <Spin spinning={isSubmitting}>

            <Form {...{values, setFieldValue, isUpdate: true, isFetched: true}}/>

          </Spin>
        );
      }}
    </EntityForm.Main>
  );
};

export default Update;