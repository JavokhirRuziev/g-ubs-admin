import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './Form';
import get from "lodash/get";

const Update = ({selected, showUpdateModal}) => {
    return (
        <EntityForm.Main
            method="put"
            entity="printer"
            name={`all`}
            url={`/printers/${get(selected, 'id')}`}
            primaryKey="id"
            normalizeData={data => data}
            id={get(selected, 'id')}
            onSuccess={(data, resetForm) => {
                resetForm();
                showUpdateModal(false)
            }}
            fields={[
                {name: "company_id",value: null},
                {name: "name", required: true, value: get(selected, 'name')},
                {name: "dns", required: true, value: get(selected, 'dns')},
                {name: "kitchener_id", required: true, value: get(selected, 'kitchener'), onSubmitValue: value => value.id},
                {
                    name: "status",
                    value: !!get(selected, 'status'),
                    onSubmitValue: value => value ? 1 : 0
                }
            ]}
            params={{
                include: 'kitchener'
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