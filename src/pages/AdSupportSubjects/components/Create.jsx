import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './Form';

const Create = ({showCreateModal, parent_id}) => {
  return (
    <EntityForm.Main
      method="post"
      entity="subjects"
      name={`subjects-${parent_id}`}
      url="/advertising-subjects"
      appendData
      primaryKey="id"
      normalizeData={data => data}
      onSuccess={(data, resetForm) => {
        resetForm();
        showCreateModal(false)
      }}
      fields={[
        {
          name: 'parent_id',
          value: parent_id
        },
        {
          name: "title",
        },
        {
          name: "description",
        },
        {
          name: "type",
          value: 1
        },
        {
          name: "sort",
        },
        {
          name: "status",
          value: true,
          onSubmitValue: value => value ? 1 : 0
        },
        {
          name: "can_download",
          value: true,
          onSubmitValue: value => value ? 1 : 0
        },
        {
          name: "files",
          value: [],
          onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
        },
        {
          name: "sources",
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
