import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './CreateClientForm';
import moment from "moment";
import get from "lodash/get";

const Create = ({showUpdateModal, selected}) => {
    return (
        <EntityForm.Main
            method="put"
            entity="customer"
            name="customers"
            url={`/customers/${selected.id}`}
            id={selected.id}
            updateData={true}
            primaryKey="id"
            normalizeData={data => data}
            onSuccess={(data, resetForm) => {
                resetForm();
                showUpdateModal(false);
            }}
            fields={[
                {name: 'company_id', value:  get(selected, 'company_id')},
                {
                    name: "name",
                    required: true,
                    value: get(selected, 'name')
                },
                {
                    name: "phone",
                    required: true,
                    value: get(selected, 'phone')
                }
            ]}
        >
            {({isSubmitting, values, setFieldValue, submitForm}) => {
                return (
                    <Spin spinning={isSubmitting}>

                        <Form {...{values, setFieldValue, submitForm, isUpdate: true}}/>

                    </Spin>
                );
            }}
        </EntityForm.Main>
    );
};

export default Create;
