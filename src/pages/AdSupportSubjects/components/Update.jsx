import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './Form';
import get from "lodash/get";

const Update = ({selected, showUpdateModal}) => {
  return (
    <EntityForm.Main
      method="put"
      entity="subjects"
      name={`subjects-${get(selected, 'id')}`}
      url={`/advertising-subjects/${get(selected, 'id')}`}
      primaryKey="id"
      normalizeData={data => data}
      id={get(selected, 'id')}
      onSuccess={(data, resetForm) => {
        resetForm();
        showUpdateModal(false)
      }}
      fields={[
        {
          name: 'parent_id',
          value: get(selected, 'parent_id'),
        },
        {
          name: "title",
          value: get(selected, 'title'),
        },
        {
          name: "description",
          value: get(selected, 'description'),
        },
        {
          name: "type",
          value: get(selected, 'type'),
        },
        {
          name: "sort",
          value: get(selected, 'sort')
        },
        {
          name: "status",
          value: get(selected, 'status'),
          onSubmitValue: value => value ? 1 : 0
        },
        {
          name: "files",
          value: get(selected, 'files0') ? get(selected, 'files0', []) : [],
          onSubmitValue: value => value ? value.reduce((prev, curr) => [...prev, curr.id], []).join(",") : undefined
        },
        {
          name: "sources",
          value: get(selected, 'sources0') ? get(selected, 'sources0', []) : [],
          onSubmitValue: value => value ? value.reduce((prev, curr) => [...prev, curr.id], []).join(",") : undefined
        },
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
