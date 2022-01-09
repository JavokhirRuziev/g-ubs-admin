import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './Form';
import get from "lodash/get";

const Update = ({selected, showUpdateModal}) => {
    return (
        <EntityForm.Main
            method="put"
            entity="menu"
            name={`all`}
            url={`/menus/${get(selected, 'id')}`}
            primaryKey="id"
            normalizeData={data => data}
            id={get(selected, 'id')}
            onSuccess={(data, resetForm) => {
                resetForm();
                showUpdateModal(false)
            }}
            fields={[
                {
                    name: "company_id",
                    value: null,
                },
                {name: "title_uz", required: true, value: get(selected, 'title_uz')},
                {name: "title_ru", required: true, value: get(selected, 'title_ru')},
                {name: "title_en", required: true, value: get(selected, 'title_en')},
                {name: "sort", value: get(selected, 'sort'), type: 'number'},
                {
                    name: "status",
                    value: !!get(selected, 'status'),
                    onSubmitValue: value => value ? 1 : 0
                }
            ]}
            params={{
                extra: {_l: 'ru'},
                include: 'company'
            }}
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