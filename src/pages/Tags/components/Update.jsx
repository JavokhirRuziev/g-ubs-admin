import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './Form';
import get from "lodash/get";

const Update = ({selected, showUpdateModal}) => {
  return (
    <EntityForm.Main
      method="put"
      entity="tag"
      name={`tags`}
      url={`/tags/${get(selected, 'id')}`}
      primaryKey="id"
      normalizeData={data => data}
      id={get(selected, 'id')}
      onSuccess={(data, resetForm) => {
        resetForm();
        showUpdateModal(false)
      }}
      fields={[
        {name: "title", required: true, value: get(selected, 'title')},
        {
          name: "status",
          value: !!get(selected, 'status'),
          onSubmitValue: value => value ? 1 : 0
        }
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