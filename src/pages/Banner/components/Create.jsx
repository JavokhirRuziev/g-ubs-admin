import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './Form';

const Create = ({showCreateModal}) => {
    return (
        <EntityForm.Main
            method="post"
            entity="banner"
            name={`all`}
            url="/banners"
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
                {name: "title_ru", required: true},
                {name: "title_en", required: true},
                {name: "title_uz", required: true},
                {name: "link"},
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