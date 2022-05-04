import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './Form';

const Create = ({showCreateModal}) => {
    return (
        <EntityForm.Main
            method="post"
            entity="menu"
            name={`all`}
            url="/menus"
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
                {name: "title_ru", required: true},
                {name: "title_uz", required: true},
                {name: "title_en", required: true},
                {name: "sort", type: 'number'},
                {name: "status", value: true, onSubmitValue: value => value ? 1 : 0},
                {name: "eighteen", value: false, onSubmitValue: value => value ? 1 : 0}
            ]}
            params={{
                extra: {_l: 'ru'},
                include: 'company'
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