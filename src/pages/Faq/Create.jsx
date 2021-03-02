import React, {useState} from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './components/Form';

import {useTranslation} from "react-i18next";
import qs from "query-string";
import get from "lodash/get";

const Create = ({location, history}) => {
    const {t} = useTranslation();

    const query = qs.parse(location.search);
    const {lang} = query;
    const [saveType, setSaveType] = useState('list');

    return (
        <EntityForm.Main
            method="faq"
            entity="faq"
            name={`faq-${lang}`}
            url="/faq"
            prependData
            primaryKey="id"
            normalizeData={data => data}
            onSuccess={(data, resetForm) => {
                resetForm();
                if(saveType === 'list'){
                    history.push(`/faq?lang=${lang}`)
                }else if(saveType === 'update'){
                    history.push(`/faq/update/${get(data, 'id')}?lang=${lang}`)
                }else if(saveType === 'create'){
                    history.push(`/faq/create?lang=${lang}`)
                }
            }}
            fields={[
                 {
                    name: "answer",
                    value: "",
                   required: true
                },
                {
                     name: "question",
                    value: "",
                     required: true
                },
                {
                    name: "status",
                    value: true,
                    onSubmitValue: value => value ? 1 : 0
                }
            ]}
            params={{
                include: "translations, files",
                extra: {_l: lang}
            }}
        >
            {({isSubmitting, values, setFieldValue}) => {
                return (
                    <Spin spinning={isSubmitting}>
                        <div className="title-md mb-20 mt-14">{t('Создать страницу')}</div>

                        <Form {...{values, lang, setFieldValue, setSaveType}}/>

                    </Spin>
                );
            }}
        </EntityForm.Main>
    );
};

export default Create;
