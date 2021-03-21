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
import {Link} from "react-router-dom";

const Update = ({location, history, match}) => {
  const TabPane = Tabs.TabPane;
  const {t} = useTranslation();

  const query = qs.parse(location.search);
  const {lang} = query;
  const {id} = match.params;

  const [tabLang, setTabLang] = useState(lang);
  const [saveType, setSaveType] = useState('list');

  const changeTab = (langCode, translations) => {
    const hasLangItem = translations.filter(({ lang }) => lang === langCode);
    if (hasLangItem.length > 0) {
      history.push(`/pages/update/${hasLangItem[0].id}?lang=${hasLangItem[0].lang}`)
    }
  };

  const isOwn = lang === tabLang;
  return (
    <EntityContainer.One
      entity="advertising"
      name={`advertising-${id}`}
      url={`/advertising/${id}`}
      primaryKey="id"
      id={id}
    >
      {({item, isFetched}) => {
        return (
          <Spin spinning={!isFetched}>
            <div className="title-md mb-20 mt-14">{t('Изменить рекламный блок')}</div>
            <Panel className="pt-0 pb-0 mb-30 d-flex justify-content-between align-items-center">
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
                  <TabPane key={item.code} tab={t(item.title)} />
                ))}
              </Tabs>
              <Link to={`/ad-support/subjects/${id}`} className={"fs-18 fw-500"}>
                Предметы - {get(item, 'subjects_count')}
              </Link>
            </Panel>

            <EntityForm.Main
              method={isOwn ? 'put' : 'post'}
              entity="advertising"
              name={`advertising-${tabLang}`}
              url={isOwn ? `/advertising/${get(item, 'id')}` : '/advertising'}
              updateData={isOwn}
              prependData={!isOwn}
              primaryKey="id"
              normalizeData={data => data}
              onSuccess={(data, resetForm) => {
                resetForm();
                if(saveType === 'list'){
                  history.push(`/ad-support?lang=${tabLang}`)
                }else if(saveType === 'update'){
                  history.push(`/ad-support/update/${get(data, 'id')}?lang=${tabLang}`)
                }else if(saveType === 'create'){
                  history.push(`/ad-support/create?lang=${tabLang}`)
                }
              }}
              fields={[
                {
                  name: "title",
                  required: true,
                  value: isOwn ? get(item, 'title') : ''
                },
                {
                  name: "description",
                  required: true,
                  value: isOwn ? get(item, 'description') : ''
                },
                {
                  name: "sort",
                  required: true,
                  value: isOwn ? get(item, 'sort') : ''
                },
                {
                  name: "file",
                  value: get(item, 'file') ?  [get(item, 'file')] : [],
                  onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
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