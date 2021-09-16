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
          name: "parent_id",
          value: parent_id,
        },
        {
          name: "name_ru",
          value: "child"
        },
        {
          name: "size",
        },
        {
          name: "code"
        },
        {
          name: "amount",
        },
        {
          name: "price",
        },
        {
          name: 'ten'
        },
        {
          name: "amount_box"
        },
        {
          name: "price_box"
        },
        {
          name: "width"
        },
        {
          name: "length"
        },
        {
          name: "thickness"
        },
        {
          name: "capacity"
        },
        {
          name: "weight"
        },
        {
          name: "height"
        },
        {
          name: "diameter"
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
