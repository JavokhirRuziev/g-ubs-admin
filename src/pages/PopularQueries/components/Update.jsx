import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './Form';
import get from "lodash/get";

const Update = ({selected, showUpdateModal}) => {
    return (
        <EntityForm.Main
            method="put"
            entity="popular-queries"
            name={`all`}
            url={`/popular-queries/${get(selected, 'id')}`}
            primaryKey="id"
            normalizeData={data => data}
            id={get(selected, 'id')}
            onSuccess={(data, resetForm) => {
                resetForm();
                showUpdateModal(false)
            }}
            params={{
                include: 'file'
            }}
            fields={[
                {name: "name_uz", required: true, value: get(selected, 'name_uz')},
                {name: "name_ru", required: true, value: get(selected, 'name_ru')},
                {name: "name_en", required: true, value: get(selected, 'name_en')},
                {name: "sort", value: get(selected, 'sort'), type: 'number'},
                {
                    name: "status",
                    value: !!get(selected, 'status'),
                    onSubmitValue: value => value ? 1 : 0
                },
                {
                    name: "file_id",
                    value: get(selected, 'file') ? [get(selected, 'file')] : [],
                    onSubmitValue: value => value.length > 0 ? value[0].id : null
                }
            ]}
            updateData
        >
            {({isSubmitting, values, setFieldValue}) => {
                return (
                    <Spin spinning={isSubmitting}>

                        <Form {...{values, setFieldValue, isUpdate: true}}/>

                    </Spin>
                );
            }}
        </EntityForm.Main>
    );
};

export default Update;