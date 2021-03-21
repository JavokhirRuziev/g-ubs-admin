import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './Form';
import get from "lodash/get";

const Update = ({selected, showUpdateModal}) => {
  return (
    <EntityForm.Main
      method="put"
      entity="partner"
      name={`partners`}
      url={`/partners/${get(selected, 'id')}`}
      primaryKey="id"
      normalizeData={data => data}
      id={get(selected, 'id')}
      onSuccess={(data, resetForm) => {
        resetForm();
        showUpdateModal(false)
      }}
      params={{
        include: 'file',
      }}
      fields={[
        {
          name: "name_ru",
          value: get(selected, 'name_ru'),
        },
        {
          name: "name_en",
          value: get(selected, 'name_en'),
        },
        {
          name: "name_uz",
          value: get(selected, 'name_uz'),
        },
        {
          name: "link",
          value: get(selected, 'link'),
        },
        {
          name: "file",
          value: get(selected, 'file') ? [get(selected, 'file', '')] : [],
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
