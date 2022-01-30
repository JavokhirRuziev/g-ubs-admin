import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './Form';

const Create = ({showCreateModal}) => {
    return (
        <EntityForm.Main
            method="post"
            entity="faq"
            name={`all`}
            url="/faq"
            appendData
            primaryKey="id"
            normalizeData={data => data}
            onSuccess={(data, resetForm) => {
                resetForm();
                showCreateModal(false)
            }}
            fields={[
                {name: "title_ru", required: true},
                {name: "title_uz"},
                {name: "title_en"},
                {name: "description_ru", required: true},
                {name: "description_uz"},
                {name: "description_en"},
                {name: "sort", type: 'number'},
                {name: "status", value: true, onSubmitValue: value => value ? 1 : 0}
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