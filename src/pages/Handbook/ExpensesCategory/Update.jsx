import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './Form';
import get from "lodash/get";

const Update = ({selected, showUpdateModal, type}) => {
    return (
        <EntityForm.Main
            method="put"
            entity="transaction-category"
            name={`all-${type}`}
            url={`/expense-categories/${get(selected, 'id')}`}
            primaryKey="id"
            normalizeData={data => data}
            id={get(selected, 'id')}
            onSuccess={(data, resetForm) => {
                resetForm();
                showUpdateModal(false)
            }}
            fields={[
                {name: "company_id", value: get(selected, 'company_id')},
                {name: "title", required: true, value: get(selected, 'title')},
                {name: 'type', value: type}
            ]}
            updateData
        >
            {({isSubmitting, values, setFieldValue}) => {
                return (
                    <Spin spinning={isSubmitting}>

                        <Form {...{values, setFieldValue, isUpdate: true, isFetched: true}}/>

                    </Spin>
                );
            }}
        </EntityForm.Main>
    );
};

export default Update;
