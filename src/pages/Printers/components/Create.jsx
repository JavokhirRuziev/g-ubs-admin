import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './Form';

const Create = ({showCreateModal}) => {
    return (
        <EntityForm.Main
            method="post"
            entity="printer"
            name={`all`}
            url="/printers"
            appendData
            primaryKey="id"
            normalizeData={data => data}
            onSuccess={(data, resetForm) => {
                resetForm();
                showCreateModal(false)
            }}
            fields={[
                {name: "company_id", value: null},
                {name: "name", required: true},
                {name: "dns", required: true},
                {name: "kitchener_id", onSubmitValue: value => value.id, required: true},
                {name: "status", value: true, onSubmitValue: value => value ? 1 : 0}
            ]}
            params={{
                include: 'kitchener'
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