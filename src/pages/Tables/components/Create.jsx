import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './Form';

const Create = ({showCreateModal}) => {
    return (
        <EntityForm.Main
            method="post"
            entity="table"
            name={`all`}
            url="/tables"
            appendData
            primaryKey="id"
            normalizeData={data => data}
            onSuccess={(data, resetForm) => {
                resetForm();
                showCreateModal(false)
            }}
            fields={[
                {
                    name: "company_id",
                    value: null,
                },
                {name: "number", required: true},
                {name: "capacity", required: true},
                {name: "place_id", required: true, onSubmitValue: value => value.id},
                {name: "status", value: true, onSubmitValue: value => value ? 1 : 0}
            ]}
            params={{
                include: 'place'
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

export default Create;