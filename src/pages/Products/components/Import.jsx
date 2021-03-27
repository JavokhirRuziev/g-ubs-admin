import React from 'react';

import {Button, Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import {Fields} from "components";
import {Field} from "formik";

const Import = ({showImportModal, successCbImport}) => {
    return (
        <EntityForm.Main
            method="post"
            entity="import"
            name="price"
            url="/import-price"
            appendData
            primaryKey="id"
            onSuccess={(data, resetForm) => {
                resetForm();
                showImportModal(false);
                successCbImport()
            }}
            fields={[
                {
                    name: "file_id",
                    value: [],
                    onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
                }
            ]}
        >
            {({isSubmitting, values, setFieldValue}) => {
                return (
                    <Spin spinning={isSubmitting}>
                        <div className="title-md fs-16 mb-20">{"Импорт прайс-листов"}</div>
                        <Field
                            component={Fields.UploadImageManager}
                            name="file_id"
                            isDocument={true}
                            size="large"
                        />
                        <Button
                            type="primary"
                            size="large"
                            className="fs-14 fw-300"
                            htmlType="submit"
                        >Импорт</Button>
                    </Spin>
                );
            }}
        </EntityForm.Main>
    );
};

export default Import;