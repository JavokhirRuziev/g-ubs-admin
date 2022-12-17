import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './IngredientsForm';
import get from "lodash/get";

const IngredientsUpdate = ({selected, showUpdateModal, parent_id}) => {
  return (
    <EntityForm.Main
      method="put"
      entity="ingredients"
      name={`all-${parent_id}`}
      url={`ingredients/${get(selected, 'id')}`}
      primaryKey="id"
      normalizeData={data => data}
      id={get(selected, 'id')}
      onSuccess={(data, resetForm) => {
        resetForm();
        showUpdateModal(false)
      }}
      fields={[
        {
          name: 'dish_id',
          value: parent_id
        },
        {
          name: "title_ru",
          value: get(selected, 'title_ru'),
        },
        {
          name: "title_uz",
          value: get(selected, 'title_uz'),
        },
        {
          name: "title_en",
          value: get(selected, 'title_en'),
        },
        {
          name: "price",
          value: get(selected, 'price'),
        },
        {
          name: "status",
          value: get(selected, 'status') === 1,
          onSubmitValue: value => value ? 1 : 0
        },
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

export default IngredientsUpdate;
