import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './Form';
import get from "lodash/get";

const Update = ({selected, showUpdateModal}) => {
    return (
        <EntityForm.Main
            method="put"
            entity="notifications"
            name={`all`}
            url={`/notifications/${get(selected, 'id')}`}
            primaryKey="id"
            normalizeData={data => data}
            id={get(selected, 'id')}
            onSuccess={(data, resetForm) => {
                resetForm();
                showUpdateModal(false)
            }}
            fields={[
                {name: "message_ru", required: true, value: get(selected, 'message_ru')},
                {name: "message_uz", value: get(selected, 'message_uz')},
                {name: "message_en", value: get(selected, 'message_en')},
                {name: "content_ru", required: true, value: get(selected, 'content_ru')},
                {name: "content_uz", value: get(selected, 'content_uz')},
                {name: "content_en", value: get(selected, 'content_en')},
                {name: "link", value: get(selected, 'link')},
                {name: "type", value: get(selected, 'type')},
                {
                    name: "status",
                    value: !!get(selected, 'status'),
                    onSubmitValue: value => value ? 1 : 0
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