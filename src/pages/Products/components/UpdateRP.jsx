import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './FormRP';
import get from "lodash/get";

const UpdateRP = ({selected, showUpdateModal, parent_id}) => {
  return (
    <EntityForm.Main
      method="put"
      entity="relationProduct"
      name={`all-${parent_id}`}
      url={`products/${get(selected, 'id')}`}
      primaryKey="id"
      normalizeData={data => data}
      id={get(selected, 'id')}
      onSuccess={(data, resetForm) => {
        resetForm();
        showUpdateModal(false)
      }}
      fields={[
        {
          name: "code",
          value: get(selected, 'code')
        },
        {
          name: "name_ru",
          value: "child"
        },
        {
          name: "size",
          value: get(selected, 'size'),
        },
        {
          name: "amount",
          value: get(selected, 'amount'),
        },
        {
          name: "price",
          value: get(selected, 'price'),
        },
        {
          name: 'parent_id',
          value: parent_id
        },
        {
          name: 'ten',
          value: get(selected, 'ten'),
        },
        {
          name: "amount_box",
          value: get(selected, 'amount_box'),
        },
        {
          name: "price_box",
          value: get(selected, 'price_box'),
        },
        {
          name: "width",
          value: get(selected, 'width'),
        },
        {
          name: "length",
          value: get(selected, 'length'),
        },
        {
          name: "thickness",
          value: get(selected, 'thickness'),
        }
      ]}
      updateData
    >
      {({isSubmitting, values, setFieldValue, submitForm}) => {
        return (
          <Spin spinning={isSubmitting}>

            <Form {...{values, setFieldValue, isUpdate: true, submitForm}}/>

          </Spin>
        );
      }}
    </EntityForm.Main>
  );
};

export default UpdateRP;
