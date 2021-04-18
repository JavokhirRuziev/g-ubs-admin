import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './Form';

import get from "lodash/get";

const Create = ({showCreateModal, loadMenuItems}) => {
  return (
    <EntityForm.Default
      method="post"
      url="/categories"
      onSuccess={(data, resetForm) => {
        resetForm();
        showCreateModal(false);
        loadMenuItems()
      }}
      params={{
        include: 'meta'
      }}
      fields={[
        {
          name: "name_uz"
        },
        {
          name: "name_ru"
        },
        {
          name: "name_en"
        },
        {
          name: "status",
          value: true,
          onSubmitValue: value => value ? 1 : 0
        },
        {
          name: "type",
          value: 1
        },
        {
          name: "sort"
        },
        {
          name: "top",
          value: false,
          onSubmitValue: value => value ? 1 : 0
        },
        {
          name: "parent_id",
          onSubmitValue: value => get(value, "id")
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
    </EntityForm.Default>
  );
};

export default Create;