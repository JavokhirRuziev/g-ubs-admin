import React, {useState} from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import EntityContainer from 'modules/entity/containers';
import Form from './components/Form';

import {useTranslation} from "react-i18next";
import get from "lodash/get";

const Update = ({history, match}) => {
    const {t} = useTranslation();

    const {id} = match.params;
    const [saveType, setSaveType] = useState('list');

    return (
        <EntityContainer.One
            entity="gallery"
            name={`galleryVideo-${id}`}
            url={`/galleries/${id}`}
            primaryKey="id"
            id={id}
        >
            {({item, isFetched}) => {
                return (
                    <Spin spinning={!isFetched}>
                        <div className="title-md mb-20 mt-14">{t('Изменить видеогалерея')}</div>

                        <EntityForm.Main
                            method={'put'}
                            entity="gallery"
                            name={`galleryVideo`}
                            url={`/galleries/${get(item, 'id')}`}
                            updateData={true}
                            primaryKey="id"
                            normalizeData={data => data}
                            onSuccess={(data, resetForm) => {
                                resetForm();
                                if (saveType === 'list') {
                                    history.push(`/gallery/video`)
                                } else if (saveType === 'update') {
                                    history.push(`/gallery/video/update/${get(data, 'id')}`)
                                } else if (saveType === 'create') {
                                    history.push(`/gallery/video/create`)
                                }
                            }}
                            fields={[
                                {
                                    name: "title_uz",
                                    required: true,
                                    value: get(item, 'title_uz')
                                },
                                {
                                    name: "title_ru",
                                    required: true,
                                    value: get(item, 'title_ru')
                                },
                                {
                                    name: "title_en",
                                    required: true,
                                    value: get(item, 'title_en')
                                },
                                {
                                    name: "status",
                                    value: get(item, 'status') === 1,
                                    onSubmitValue: value => value ? 1 : 0
                                },
                                {
                                    name: 'type',
                                    value: 2
                                },
                                {
                                    name: 'link',
                                    value: get(item, 'link')
                                }
                            ]}
                        >
                            {({isSubmitting, values, setFieldValue}) => {
                                return (
                                    <Spin spinning={isSubmitting}>

                                        <Form {...{values, setFieldValue, isUpdate: true, setSaveType}}/>

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
