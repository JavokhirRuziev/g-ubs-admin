import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './Form';

const Create = ({showCreateModal}) => {
    return (
        <EntityForm.Main
            method="post"
            entity="place"
            name={`all`}
            url="/places"
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
                {name: "tip", value: 0, type: 'number'},
                {name: "title_ru", required: true},
                {name: "title_uz", required: true},
                {name: "title_en", required: true},
                {name: "sort", type: 'number'},
                {name: "status", value: true, onSubmitValue: value => value ? 1 : 0},
                {
                    name: "gallery",
                    value: [],
                    onSubmitValue: value => value.length > 0 ? value.reduce((prev, curr) => [...prev, curr.id], []).join(",") : null
                },
            ]}
            params={{
                include: 'company',
                extra: {_l: 'ru', append: 'gallery0'},
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