import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './Form';

const Create = ({showCreateModal, langCode}) => {
  return (
    <EntityForm.Main
      method="post"
      entity="menu"
      name={`menu-${langCode}`}
      url="/menu"
      prependData
      primaryKey="menu_id"
      normalizeData={data => data}
      onSuccess={(data, resetForm) => {
        resetForm();
        showCreateModal()
      }}
      params={{
        extra: {_l: langCode}
      }}
      fields={[
        {name: "title", required: true},
        {name: "alias", required: true}
      ]}
    >
      {({isSubmitting}) => {
        return (
          <Spin spinning={isSubmitting}>

            <Form {...{isFetched: true}}/>

          </Spin>
        );
      }}
    </EntityForm.Main>
  );
};

export default Create;