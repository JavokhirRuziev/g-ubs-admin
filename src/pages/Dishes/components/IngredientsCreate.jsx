import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './IngredientsForm';

const IngredientsCreate = ({showCreateModal, parent_id}) => {
  return (
    <EntityForm.Main
      method="post"
      entity="ingredients"
      name={`all-${parent_id}`}
      url="/ingredients"
      appendData
      primaryKey="id"
      normalizeData={data => data}
      onSuccess={(data, resetForm) => {
        resetForm();
        showCreateModal(false)
      }}
      fields={[
        {
          name: "dish_id",
          value: parent_id,
        },
        {
          name: "title_ru",
          required: true
        },
        {
          name: "title_uz",
          required: true
        },
        {
          name: "title_en",
          required: true
        },
        {
          name: "price",
          required: true
        },
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

export default IngredientsCreate;
