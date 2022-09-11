import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './Form';

const Create = ({showCreateModal, type}) => {
    return (
        <EntityForm.Main
            method="post"
            entity="transaction-category"
            name={`all-${type}`}
            url="/expense-categories"
            prependData={true}
            primaryKey="id"
            normalizeData={data => data}
            onSuccess={(data, resetForm) => {
                resetForm();
                showCreateModal(false)
            }}
            fields={[
                {name: "company_id", value: null},
                {name: "title", required: true},
                {name: 'type', value: type}
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
