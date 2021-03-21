import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './Form';

const Create = ({showCreateModal}) => {
  return (
    <EntityForm.Main
      method="post"
      entity="category"
      name="categoryBlog"
      url="/categories"
      appendData
      primaryKey="id"
      normalizeData={data => data}
      onSuccess={(data, resetForm) => {
        resetForm();
        showCreateModal(false)
      }}
      fields={[
        {
          name: "name_ru",
          required: true
        },
        {
          name: "name_en",
          required: true
        },
        {
          name: "name_uz",
          required: true
        },
        {
          name: "status",
          value: true,
          onSubmitValue: value => value ? 1 : 0
        },
        {
          name: "type",
          value: 3
        },
        {
          name: "sort",
        },
        {
          name: "file",
          value: [],
          onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
        },
      ]}
    >
      {({isSubmitting, values, setFieldValue}) => {
        return (
          <Spin spinning={isSubmitting}>

            <Form {...{values, setFieldValue}}/>

          </Spin>
        );
      }}
    </EntityForm.Main>
  );
};

export default Create;
