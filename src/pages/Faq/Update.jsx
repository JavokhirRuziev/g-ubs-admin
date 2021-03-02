import React, {useState} from 'react';

import {Spin, Tabs} from 'antd';
import {Panel} from 'components';
import EntityForm from 'modules/entity/forms';
import EntityContainer from 'modules/entity/containers';
import Form from './components/Form';

import {useTranslation} from "react-i18next";
import qs from "query-string";
import get from "lodash/get";
import config from "config";

const Update = ({location, history, match}) => {
    const TabPane = Tabs.TabPane;
    const {t} = useTranslation();

    const query = qs.parse(location.search);
    const {lang} = query;
    const {id} = match.params;

    const [tabLang, setTabLang] = useState(lang);
    const [saveType, setSaveType] = useState('list');

    const changeTab = (langCode, translations) => {
        const hasLangItem = translations.filter(({lang}) => lang === langCode);
        if (hasLangItem.length > 0) {
            history.push(`/faq/update/${hasLangItem[0].id}?lang=${hasLangItem[0].lang}`)
        }
    };

    const isOwn = lang === tabLang;
    return (
        <EntityContainer.One
            entity="faq"
            name={`faq-${id}`}
            url={`/faq/${id}`}
            primaryKey="id"
            id={id}
            params={{
                include: "translations",
            }}
        >
            {({item, isFetched}) => {
                return (
                    <Spin spinning={!isFetched}>
                        <div className="title-md mb-20 mt-14">{t('Изменить')}</div>
                        <Panel className="pad-0 mb-30">
                            <Tabs
                                activeKey={tabLang}
                                onChange={value => {
                                    setTabLang(value);
                                    changeTab(value, item.translations);
                                }}
                                tabBarStyle={{
                                    marginBottom: "0"
                                }}
                            >
                                {config.API_LANGUAGES.map(item => (
                                    <TabPane key={item.code} tab={t(item.title)}/>
                                ))}
                            </Tabs>
                        </Panel>

                        <EntityForm.Main
                            method={isOwn ? 'put' : 'post'}
                            entity="faq"
                            name={`faq-${tabLang}`}
                            url={isOwn ? `/faq/${get(item, 'id')}` : '/faq'}
                            updateData={isOwn}
                            prependData={!isOwn}
                            primaryKey="id"
                            normalizeData={data => data}
                            onSuccess={(data, resetForm) => {
                                resetForm();
                                if (saveType === 'list') {
                                    history.push(`/faq?lang=${tabLang}`)
                                } else if (saveType === 'update') {
                                    history.push(`/faq/update/${get(data, 'id')}?lang=${tabLang}`)
                                } else if (saveType === 'create') {
                                    history.push(`/faq/create?lang=${tabLang}`)
                                }
                            }}
                            fields={[
                                {
                                    name: "answer",
                                    value: get(item, 'answer'),
                                    required: true
                                },
                                {
                                    name: "question",
                                    required: true,
                                    value: get(item, 'question')
                                },

                                {
                                    name: "status",
                                    value: get(item, 'status') === 1,
                                    onSubmitValue: value => value ? 1 : 0
                                },
                                {
                                    name: "lang_hash",
                                    value: get(item, 'lang_hash')
                                }
                            ]}
                            params={{
                                include: ['translations'],
                                extra: {_l: tabLang}
                            }}
                        >
                            {({isSubmitting, values, setFieldValue}) => {
                                return (
                                    <Spin spinning={isSubmitting}>

                                        <Form {...{values, lang, setFieldValue, isUpdate: true, setSaveType}}/>

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