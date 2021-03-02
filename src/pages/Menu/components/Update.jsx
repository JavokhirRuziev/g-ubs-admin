import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './Form';
import get from "lodash/get";

const Update = ({selected, showUpdateModal, langCode}) => {
  return (
    <EntityForm.Main
      method="put"
      entity="menu"
      name={`menu-${langCode}`}
      url={`/menu/${get(selected, 'menu_id')}`}
      primaryKey="menu_id"
      normalizeData={data => data}
      id={selected.menu_id}
      onSuccess={(data, resetForm) => {
        resetForm();
        showUpdateModal(false)
      }}
      params={{
        extra: {_l: langCode}
      }}
      fields={[
        {name: "title", value: get(selected, 'title'), required: true},
        {name: "alias", value: get(selected, 'alias'), required: true},
      ]}
      updateData
    >
      {({isSubmitting}) => {
        return (
          <Spin spinning={isSubmitting}>

            <Form {...{isUpdate: true}}/>

          </Spin>
        );
      }}
    </EntityForm.Main>
  );
};

export default Update;