import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './FormRP';

const CreateRP = ({showCreateModal, parent_id}) => {
  return (
    <EntityForm.Main
      method="post"
      entity="relationProduct"
      name={`all-${parent_id}`}
      url="/products"
      appendData
      primaryKey="id"
      normalizeData={data => data}
      onSuccess={(data, resetForm) => {
        resetForm();
        showCreateModal(false)
      }}
      fields={[
        {
          name: "code"
        },
        {
          name: "name_ru",
          value: "child"
        },
        {
          name: "size",
          required: true
        },
        {
          name: "amount",
          required: true,
        },
        {
          name: "parent_id",
          value: parent_id,
        },
        {
          name: "price",
        }
      ]}
    >
      {({isSubmitting, values, setFieldValue, submitForm}) => {
        return (
          <Spin spinning={isSubmitting}>

            <Form {...{values, setFieldValue, submitForm}}/>

          </Spin>
        );
      }}
    </EntityForm.Main>
  );
};

export default CreateRP;
