import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './Form';

const Create = ({showCreateModal}) => {
  return (
    <EntityForm.Main
      method="post"
      entity="partner"
      name="partners"
      url="/partners"
      appendData
      primaryKey="id"
      normalizeData={data => data}
      onSuccess={(data, resetForm) => {
        resetForm();
        showCreateModal(false)
      }}
      params={{
        include: 'file',
      }}
      fields={[
        {
          name: "name_ru",
        },
        {
          name: "name_en",
        },
        {
          name: "name_uz",
        },
        {
          name: "link",
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
