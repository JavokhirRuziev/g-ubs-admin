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
      name={`categoryBlog`}
      url={`/categories/${get(selected, 'id')}`}
      primaryKey="id"
      normalizeData={data => data}
      id={get(selected, 'id')}
      onSuccess={(data, resetForm) => {
        resetForm();
        showUpdateModal(false)
      }}
      fields={[
        {
          name: "name_ru",
          value: get(selected, 'name_ru'),
          required: true
        },
        {
          name: "name_en",
          value: get(selected, 'name_en'),
          required: true
        },
        {
          name: "name_uz",
          value: get(selected, 'name_uz'),
          required: true
        },
        {
          name: "status",
          required: true,
          value: get(selected, 'status') === 1,
          onSubmitValue: value => value ? 1 : 0
        },
        {
          name: "type",
          value: 3
        },
        {
          name: "sort",
          value: get(selected, 'sort')
        },
        {
          name: "file",
          value: get(selected, 'file') ? [get(selected, 'file', '')] : [],
          onSubmitValue: value => value ? value.reduce((prev, curr) => [...prev, curr.id], []).join(",") : undefined
        },
      ]}
      updateData
    >
      {({isSubmitting, values, setFieldValue}) => {
        return (
          <Spin spinning={isSubmitting}>

            <Form {...{values, setFieldValue, isUpdate: true}}/>

          </Spin>
        );
      }}
    </EntityForm.Main>
  );
};

export default Update;
