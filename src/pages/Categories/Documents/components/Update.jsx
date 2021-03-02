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
      name={`categoryDocument`}
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
          value: get(selected, 'name_ru')
        },
        {
          name: "name_uz",
          value: get(selected, 'name_uz')
        },
        {
          name: "name_en",
          value: get(selected, 'name_en')
        },
        {
          name: "status",
          required: true,
          value: get(selected, 'status') === 1,
          onSubmitValue: value => value ? 1 : 0
        },
        {
          name: "type",
          value: "document"
        },
        {
          name: "parent_id",
          value: get(selected, 'parent', null),
          onSubmitValue: value => get(value, "id")
        },
        {
          name: "icon",
          value: get(selected, 'files') ? [get(selected, 'files', '')] : [],
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