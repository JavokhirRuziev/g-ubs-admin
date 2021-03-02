import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './Form';
import get from "lodash/get";

const Update = ({selected, closeUpdateModal}) => {
  return (
    <EntityForm.Main
      method="put"
      entity="country"
      name={`all`}
      url={`/country/${get(selected, 'id')}`}
      primaryKey="id"
      normalizeData={data => data}
      id={get(selected, 'id')}
      onSuccess={(data, resetForm) => {
        resetForm();
        closeUpdateModal()
      }}
      fields={[
        {
          name: "name",
          value: get(selected,'name',''),
          required: true
        },
        {
          name: "flag",
          value: get(selected, 'flag') ? [{id: 1, link: selected.flag}] : [],
          onSubmitValue: value => value.length > 0 ? value[0].link : ''
        },
        {
          name: "photo",
          value: Array.isArray(get(selected, 'files'))  ? selected.files : [],
          onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
        },
      ]}
      updateData
      params={{
        include: 'files'
      }}
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

export default Update;