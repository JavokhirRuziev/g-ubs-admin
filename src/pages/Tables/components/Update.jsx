import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './Form';
import get from "lodash/get";

const Update = ({selected, showUpdateModal}) => {
    return (
        <EntityForm.Main
            method="put"
            entity="table"
            name={`all`}
            url={`/tables/${get(selected, 'id')}`}
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
                {name: "number", required: true, value: get(selected, 'number')},
                {name: "capacity", required: true, value: get(selected, 'capacity')},
                {name: "place_id", required: true, value: get(selected, 'place'), onSubmitValue: value => value.id},
                {
                    name: "status",
                    value: !!get(selected, 'status'),
                    onSubmitValue: value => value ? 1 : 0
                }
            ]}
            params={{
                include: 'place'
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