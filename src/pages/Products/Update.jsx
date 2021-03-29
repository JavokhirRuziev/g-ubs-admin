import React, {useState} from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import EntityContainer from 'modules/entity/containers';
import Form from './components/Form';
import Actions from "store/actions/entities";

import {useTranslation} from "react-i18next";
import get from "lodash/get";
import {useDispatch} from "react-redux";

const Update = ({history, match}) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const {id} = match.params;
    const [saveType, setSaveType] = useState('list');

    return (
        <EntityContainer.One
            entity="product"
            name={`products-${id}`}
            url={`/products/${id}`}
            primaryKey="id"
            id={id}
            params={{
                include: "category,posts",
                extra: {append: 'palette0,documents0,threeD0'}
            }}
        >
            {({item, isFetched}) => {
                return (
                    <Spin spinning={!isFetched}>
                        <div className="title-md mb-20 mt-14">{t('Изменить продукт')}</div>
                        <EntityForm.Main
                            method={'put'}
                            entity="product"
                            name={`products`}
                            url={`/products/${get(item, 'id')}`}
                            updateData={true}
                            primaryKey="id"
                            normalizeData={data => data}
                            onSuccess={(data, resetForm) => {
                                resetForm();
                                if (saveType === 'list') {
                                    history.push(`/products`)
                                } else if (saveType === 'update') {
                                    history.push(`/products/update/${get(data, 'id')}`)
                                } else if (saveType === 'create') {
                                    history.push(`/products/create`)
                                }

                                dispatch(Actions.Update.success({
                                    entity: 'product',
                                    entityId: Number(id),
                                    data: data
                                }))
                            }}
                            fields={[
                                {
                                    name: "color",
                                    value: '#000000',
                                    disabled: true
                                },
                                {
                                    name: 'palette',
                                    value: get(item, 'palette0'),
                                    onSubmitValue: value => value.length > 0 ? value.reduce((prev, curr) => [...prev, {
                                        color: curr.color,
                                        files: curr.files.reduce((prev, curr) => [...prev, curr.id], [])
                                    }], []) : [],
                                },
                                {
                                    name: "name_uz",
                                    value: get(item, 'name_uz', '')
                                },
                                {
                                    name: "code",
                                    value: get(item, 'code', '')
                                },
                                {
                                    name: "name_ru",
                                    required: true,
                                    value: get(item, 'name_ru', '')
                                },
                                {
                                    name: "name_en",
                                    value: get(item, 'name_en', '')
                                },
                                {
                                    name: "body_uz",
                                    value: get(item, 'body_uz', "") ? get(item, 'body_uz', "") : ''
                                },
                                {
                                    name: "body_ru",
                                    value: get(item, 'body_ru', "") ? get(item, 'body_ru', "") : ''
                                },
                                {
                                    name: "body_en",
                                    value: get(item, 'body_en', "") ? get(item, 'body_en', "") : ''
                                },
                                {
                                    name: "category_id",
                                    value: get(item, 'category'),
                                    onSubmitValue: value => value ? value.id : null
                                },
                                {
                                    name: "documents",
                                    value: get(item, 'documents0', []),
                                    onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
                                },
                                {
                                    name: "status",
                                    value: get(item, 'status'),
                                    onSubmitValue: value => value ? 1 : 0
                                },
                                {
                                    name: "top",
                                    value: get(item, 'top'),
                                    onSubmitValue: value => value ? 1 : 0
                                },
                                {
                                    name: "price",
                                    value: get(item, 'price'),
                                },
                                {
                                    name: "threeD",
                                    value: get(item, 'threeD0', []),
                                    onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
                                },
                                {
                                    name: "paletteUpload",
                                    value: [],
                                    disabled: true
                                },
                                {
                                    name: "file",
                                    value: get(item, 'file') ? [get(item, 'file')] : [],
                                    onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
                                },
                                {
                                    name: "lang_hash",
                                    value: get(item, 'lang_hash')
                                },
                                {
                                    name: 'posts',
                                    value: get(item, 'posts'),
                                    onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], [])
                                }
                            ]}
                            params={{
                                include: ['category','posts'],
                                extra: {append: 'palette0,documents0,threeD0'}
                            }}
                        >
                            {({isSubmitting, values, setFieldValue}) => {
                                return (
                                    <Spin spinning={isSubmitting}>

                                        <Form {...{
                                            values,
                                            lang: "ru",
                                            setFieldValue,
                                            isUpdate: true,
                                            isFetched,
                                            setSaveType
                                        }}/>

                                    </Spin>
                                );
                            }}
                        </EntityForm.Main>

                    </Spin>
                )
            }}
        </EntityContainer.One>
    );
};

export default Update;
