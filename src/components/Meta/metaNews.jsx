import React from 'react';

import {Button, Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import get from "lodash/get";
import {Field} from "formik";
import {Fields} from "../index";
import {useTranslation} from "react-i18next";

const Meta = ({selected, showMetaModal, lang}) => {
    const {t} = useTranslation();

    return (
        <EntityForm.Main
            method="post"
            entity="meta"
            name={`meta`}
            url={`/meta`}
            primaryKey="id"
            normalizeData={data => data}
            id={get(selected, 'id')}
            onSuccess={(data, resetForm) => {
                resetForm();
                showMetaModal(false)
            }}
            fields={[
                {
                    name: `meta_title_${lang}`,
                },
                {
                    name: `meta_description_${lang}`,
                },
                {
                    name: `meta_keywords_${lang}`,
                },
                {
                    name: "metaable_type",
                    value: 'App\\Models\\Post'
                },
                {
                    name: "metaable_id",
                    value: get(selected, 'id')
                }
            ]}
            updateData
        >
            {({isSubmitting}) => {
                return (
                    <Spin spinning={isSubmitting}>

                        <div>
                            <div className="title-md fs-16 mb-20">Мета теги</div>

                            <Field
                                component={Fields.AntInput}
                                name={`meta_title_${lang}`}
                                type="text"
                                placeholder="Введите meta title"
                                size="large"
                            />
                            <Field
                                component={Fields.AntTextarea}
                                name={`meta_description_${lang}`}
                                type="text"
                                placeholder="Введите meta description"
                                size="large"
                            />
                            <Field
                                component={Fields.AntTextarea}
                                name={`meta_keywords_${lang}`}
                                rows={5}
                                type="text"
                                placeholder="Введите meta keywords"
                                size="large"
                            />

                            <Button
                                type="primary"
                                size="large"
                                className="fs-14 fw-300"
                                htmlType="submit"
                            >{t("Сохранить")}</Button>
                        </div>

                    </Spin>
                );
            }}
        </EntityForm.Main>
    );
};

export default Meta;
