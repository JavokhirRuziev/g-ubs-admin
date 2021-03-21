import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './Form';
import get from "lodash/get";

const Update = ({selected, showUpdateModal, tabLang}) => {
  return (
    <EntityForm.Main
      method="put"
      entity="banner"
      name={`banner-${tabLang}`}
      url={`/banners/${get(selected, 'id')}`}
      primaryKey="id"
      normalizeData={data => data}
      id={get(selected, 'id')}
      onSuccess={(data, resetForm) => {
        resetForm();
        showUpdateModal(false)
      }}
      fields={[
        {
          name: "link",
          value: get(selected, 'link'),
          required: true
        },
        {
          name: "status",
          required: true,
          value: get(selected, 'status') === 1,
          onSubmitValue: value => value ? 1 : 0
        },
        {
          name: "sort",
          value: get(selected, 'sort')
        },
        {
          name: "file",
          value: get(selected, 'files') ? [get(selected, 'files', '')] : [],
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
