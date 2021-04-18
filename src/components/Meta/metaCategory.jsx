import React, {useState} from 'react';

import {Button, Spin, Tabs} from 'antd';
import EntityForm from 'modules/entity/forms';
import Actions from "store/actions";

import get from "lodash/get";
import {Field} from "formik";
import {Fields} from "../index";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";

const { TabPane } = Tabs;

const Meta = ({selected, showMetaModal}) => {
    const {t} = useTranslation();
    const [activeTab, setTab] = useState('ru');
    const dispatch = useDispatch();

    const meta = get(selected, 'meta');

    const includeMeta = (meta) => {
        dispatch(Actions.entities.Update.success({
            entity: 'category',
            entityId: get(selected, 'id'),
            data: {
                ...selected,
                meta: meta
            }
        }))
    }

    return (
        <EntityForm.Main
            method={meta ? 'put' : 'post'}
            entity="meta"
            name={`meta`}
            url={meta ? `/meta/${get(meta, 'id')}` : '/meta'}
            primaryKey="id"
            normalizeData={data => data}
            id={get(selected, 'id')}
            onSuccess={(data, resetForm) => {
                resetForm();
                showMetaModal(false);
                includeMeta(data);
            }}
            fields={[
                {
                    name: "title_ru",
                    value: get(meta, 'title_ru', '')
                },
                {
                    name: "meta_title_ru",
                    value: get(meta, 'meta_title_ru', '')
                },
                {
                    name: "meta_description_ru",
                    value: get(meta, 'meta_description_ru', '')
                },
                {
                    name: "meta_keywords_ru",
                    value: get(meta, 'meta_keywords_ru', '')
                },
                {
                    name: "title_uz",
                    value: get(meta, 'title_uz', '')
                },
                {
                    name: "meta_title_uz",
                    value: get(meta, 'meta_title_uz', '')
                },
                {
                    name: "meta_description_uz",
                    value: get(meta, 'meta_description_uz', '')
                },
                {
                    name: "meta_keywords_uz",
                    value: get(meta, 'meta_keywords_uz', '')
                },
                {
                    name: "title_en",
                    value: get(meta, 'title_en', '')
                },
                {
                    name: "meta_title_en",
                    value: get(meta, 'meta_title_en', '')
                },
                {
                    name: "meta_description_en",
                    value: get(meta, 'meta_description_en', '')
                },
                {
                    name: "meta_keywords_en",
                    value: get(meta, 'meta_keywords_en', '')
                },
                {
                    name: "metaable_type",
                    value: 'App\\Models\\Category'
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

                            <Tabs defaultActiveKey={activeTab} onChange={value => setTab(value)}>
                                <TabPane tab="RU" key={'ru'}>
                                    <Field
                                        component={Fields.AntInput}
                                        name="title_ru"
                                        type="text"
                                        placeholder="Введите заголовок (h1)"
                                        size="large"
                                    />
                                    <Field
                                        component={Fields.AntInput}
                                        name="meta_title_ru"
                                        type="text"
                                        placeholder="Введите meta title"
                                        size="large"
                                    />
                                    <Field
                                        component={Fields.AntTextarea}
                                        name="meta_description_ru"
                                        type="text"
                                        placeholder="Введите meta description"
                                        size="large"
                                    />
                                    <Field
                                        component={Fields.AntTextarea}
                                        name="meta_keywords_ru"
                                        rows={5}
                                        type="text"
                                        placeholder="Введите meta keywords"
                                        size="large"
                                    />
                                </TabPane>
                                <TabPane tab="UZ" key={'uz'}>
                                    <Field
                                        component={Fields.AntInput}
                                        name="title_uz"
                                        type="text"
                                        placeholder="Введите заголовок (h1)"
                                        size="large"
                                    />
                                    <Field
                                        component={Fields.AntInput}
                                        name="meta_title_uz"
                                        type="text"
                                        placeholder="Введите meta title"
                                        size="large"
                                    />
                                    <Field
                                        component={Fields.AntTextarea}
                                        name="meta_description_uz"
                                        type="text"
                                        placeholder="Введите meta description"
                                        size="large"
                                    />
                                    <Field
                                        component={Fields.AntTextarea}
                                        name="meta_keywords_uz"
                                        rows={5}
                                        type="text"
                                        placeholder="Введите meta keywords"
                                        size="large"
                                    />
                                </TabPane>
                                <TabPane tab="EN" key={'en'}>
                                    <Field
                                        component={Fields.AntInput}
                                        name="title_en"
                                        type="text"
                                        placeholder="Введите заголовок (h1)"
                                        size="large"
                                    />
                                    <Field
                                        component={Fields.AntInput}
                                        name="meta_title_en"
                                        type="text"
                                        placeholder="Введите meta title"
                                        size="large"
                                    />
                                    <Field
                                        component={Fields.AntTextarea}
                                        name="meta_description_en"
                                        type="text"
                                        placeholder="Введите meta description"
                                        size="large"
                                    />
                                    <Field
                                        component={Fields.AntTextarea}
                                        name="meta_keywords_en"
                                        rows={5}
                                        type="text"
                                        placeholder="Введите meta keywords"
                                        size="large"
                                    />
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
