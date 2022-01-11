import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './Form';

const Create = ({showCreateModal}) => {
    return (
        <EntityForm.Main
            method="post"
            entity="popular-queries"
            name={`all`}
            url="/popular-queries"
            appendData
            primaryKey="id"
            normalizeData={data => data}
            onSuccess={(data, resetForm) => {
                resetForm();
                showCreateModal(false)
            }}
            params={{
                include: 'file'
            }}
            fields={[
                {name: "name_ru", required: true},
                {name: "name_en", required: true},
                {name: "name_uz", required: true},
                {name: "sort", type: 'number'},
                {name: "status", value: true, onSubmitValue: value => value ? 1 : 0},
                {
                    name: "file_id",
                    value: [],
                    required: true,
                    onSubmitValue: value => value.length > 0 ? value[0].id : null
                }
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