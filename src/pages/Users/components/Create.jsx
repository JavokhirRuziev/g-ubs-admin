import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './Form';

const Create = ({showCreateModal}) => {
  return (
    <EntityForm.Main
      method="post"
      entity="user"
      name="users"
      url="/user"
      appendData
      primaryKey="id"
      normalizeData={data => data}
      onSuccess={(data, resetForm) => {
        resetForm();
        showCreateModal(false)
      }}
      fields={[
        {name: "username", required: true},
        {name: "password", required: true},
        {
          name: "status",
          value: true,
          onSubmitValue: value => value ? 10 : 1
        }
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