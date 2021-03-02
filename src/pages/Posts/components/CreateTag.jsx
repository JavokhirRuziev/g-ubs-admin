import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from '../../Tags/components/Form';

const Create = ({closeHandler}) => {
  return (
    <EntityForm.Main
      method="post"
      entity="tag"
      name={`tags`}
      url="/tags"
      appendData
      primaryKey="id"
      normalizeData={data => data}
      onSuccess={(data, resetForm) => {
        resetForm();
        closeHandler()
      }}
      fields={[
        {name: "title", required: true},
        {name: "status", value: true, onSubmitValue: value => value ? 1 : 0}
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