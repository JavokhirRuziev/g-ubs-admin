import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './ClientForm';

const Create = ({setCreateModal, type}) => {
    return (
        <EntityForm.Main
            method="post"
            entity="person"
            name={`type-${type}`}
            url="/customers"
            appendData
            primaryKey="id"
            normalizeData={data => data}
            onSuccess={(data, resetForm) => {
                resetForm();
                setCreateModal(false)
            }}
            fields={[
                {name: 'type', value: type},
                {name: 'company_id', value:  null},
                {name: "name", required: true},
                {name: "phone", required: true},
            ]}
        >
            {({isSubmitting, values}) => {
                return (
                    <Spin spinning={isSubmitting}>

                        <Form {...{values, type}}/>

                    </Spin>
                );
            }}
        </EntityForm.Main>
    );
};

export default Create;
