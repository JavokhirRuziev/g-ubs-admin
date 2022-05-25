import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './Form';
import get from "lodash/get";

const Update = ({selected, showUpdateModal}) => {
    return (
        <EntityForm.Main
            method="put"
            entity="unit"
            name={`all`}
            url={`/units/${get(selected, 'id')}`}
            primaryKey="id"
            normalizeData={data => data}
            id={get(selected, 'id')}
            onSuccess={(data, resetForm) => {
                resetForm();
                showUpdateModal(false)
            }}
            fields={[
                {name: "title_ru", required: true, value: get(selected, 'title_ru')},
                {name: "title_uz", value: get(selected, 'title_uz')},
                {name: "title_en", value: get(selected, 'title_en')},
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