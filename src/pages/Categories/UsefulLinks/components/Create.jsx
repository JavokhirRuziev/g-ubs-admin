import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './Form';

const Create = ({showCreateModal}) => {
  return (
    <EntityForm.Main
      method="post"
      entity="category"
      name={`categoryUseful`}
      url="/useful-links-category"
      appendData
      primaryKey="id"
      normalizeData={data => data}
      onSuccess={(data, resetForm) => {
        resetForm();
        showCreateModal(false)
      }}
      fields={[
        {name: "name_ru"},
        {name: "name_uz"},
        {name: "name_en"},
        {name: "slug"},
        {name: "sort", required: true, onSubmitValue: value => Number(value)},
        {name: "type", required: true, value: 1},
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