import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './Form';

const Create = ({showCreateModal}) => {
  return (
    <EntityForm.Main
      method="post"
      entity="user"
      name="waiter"
      url="/user"
      appendData
      primaryKey="id"
      normalizeData={data => data}
      onSuccess={(data, resetForm) => {
        resetForm();
        showCreateModal(false)
      }}
      fields={[
        {name: "role", required: true, value: 'waiter'},
        {name: "name", required: true},
        {name: "login", required: true},
        {name: "password", required: true},
        {name: "company_id", value: null},
          {
              name: "status",
              value: true,
              onSubmitValue: value => value ? 1 : 0
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