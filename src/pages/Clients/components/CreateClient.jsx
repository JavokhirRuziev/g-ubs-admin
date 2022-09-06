import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './CreateClientForm';
import moment from "moment";

const Create = ({setCreateModal}) => {
    return (
        <EntityForm.Main
            method="post"
            entity="customer"
            name="customers"
            url="/customers"
            appendData
            primaryKey="id"
            normalizeData={data => data}
            onSuccess={(data, resetForm) => {
                resetForm();
                setCreateModal(false)
            }}
            fields={[
                {name: 'company_id', value:  null},
                {name: "name", required: true},
                {name: "surname"},
                {name: "phone", required: true},
                // {
                //     name: "birthday",
                //     onSubmitValue: value => (!!value ? moment(value).unix() : ""),
                //     value: moment()
                // }
            ]}
        >
            {({isSubmitting, values, setFieldValue, submitForm}) => {
                return (
                    <Spin spinning={isSubmitting}>

                        <Form {...{values, setFieldValue, submitForm}}/>

                    </Spin>
                );
            }}
        </EntityForm.Main>
    );
};

export default Create;
