import React, {useState} from 'react';

import {Button, Spin, Tabs} from 'antd';
import EntityForm from 'modules/entity/forms';
import get from "lodash/get";
import {Field} from "formik";
import {Fields} from "../index";
import {useTranslation} from "react-i18next";

const { TabPane } = Tabs;

const Meta = ({selected, showMetaModal, type='product'}) => {
    const {t} = useTranslation();
    const [activeTab, setTab] = useState('ru');

    return (
        <EntityForm.Main
            method="put"
            entity="meta"
            name={`meta`}
            url={`/admin/meta/${get(selected, 'id')}`}
            primaryKey="id"
            normalizeData={data => data}
            id={get(selected, 'id')}
            onSuccess={(data, resetForm) => {
                resetForm();
                showMetaModal(false)
            }}
            fields={[
                {
                    name: "meta_title",
                },
                {
                    name: "meta_description",
                },
                {
                    name: "meta_keywords",
                    required: true
                },

                {
                    name: "metaable_id",
                    value: null
                },
                {
                    name: "metaable_type",
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

                            <Tabs defaultActiveKey={activeTab} onChange={value => setTab(value)}>
                                <TabPane tab="RU" key={'ru'}>
                                    <Field
                                        component={Fields.AntInput}
                                        name="meta_title"
                                        type="text"
                                        placeholder="Введите meta title"
                                        size="large"
                                    />
                                    <Field
                                        component={Fields.AntTextarea}
                                        name="meta_description"
                                        type="text"
                                        placeholder="Введите meta description"
                                        size="large"
                                    />
                                    <Field
                                        component={Fields.AntTextarea}
                                        name="meta_keywords"
                                        rows={5}
                                        type="text"
                                        placeholder="Введите meta keywords"
                                        size="large"
                                    />
                                </TabPane>
                                <TabPane tab="UZ" key={'uz'}>

                                </TabPane>
                                <TabPane tab="EN" key={'en'}>

                                </TabPane>
                            </Tabs>

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
