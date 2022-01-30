import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './Form';

const Create = ({showCreateModal}) => {
    return (
        <EntityForm.Main
            method="post"
            entity="notifications"
            name={`all`}
            url="/notifications"
            appendData
            primaryKey="id"
            normalizeData={data => data}
            onSuccess={(data, resetForm) => {
                resetForm();
                showCreateModal(false)
            }}
            fields={[
                {name: "message_ru", required: true},
                {name: "message_uz"},
                {name: "message_en"},
                {name: "content_ru", required: true},
                {name: "content_uz"},
                {name: "content_en"},
                {name: "link"},
                {name: "type", value: 1},
                {name: "status", value: false, onSubmitValue: value => value ? 1 : 0}
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