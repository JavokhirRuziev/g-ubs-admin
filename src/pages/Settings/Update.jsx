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
  const {t} = useTranslation("");

  const query = qs.parse(location.search);
  const {lang} = query;
  const {id} = match.params;

  const [tabLang, setTabLang] = useState(lang);

  const changeTab = (langCode, translations) => {
    const hasLangItem = translations.filter(({ lang }) => lang === langCode);
    if (hasLangItem.length > 0) {
      history.push(`/settings/update/${hasLangItem[0].id}?lang=${hasLangItem[0].lang}`)
    }
  };

  const isOwn = lang === tabLang;
  return (
    <EntityContainer.One
      entity="setting"
      name={`settings-${id}`}
      url={`/settings/${id}`}
      primaryKey="id"
      id={id}
      params={{
        include: "files",
      }}
    >
      {({item, isFetched}) => {
        return (
          <Spin spinning={!isFetched}>
            <div className="title-md mb-20 mt-14">{t('Изменить настройку')}</div>
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
                  <TabPane key={item.code} tab={t(item.title)} />
                ))}
              </Tabs>
            </Panel>

            <EntityForm.Main
              method={isOwn ? 'put' : 'post'}
              entity="setting"
              name={`settings-${tabLang}`}
              url={isOwn ? `/settings/${get(item, 'id')}` : '/settings'}
              updateData={isOwn}
              prependData={!isOwn}
              primaryKey="id"
              normalizeData={data => data}
              onSuccess={(data, resetForm) => {
                resetForm();
                history.push(`/settings?lang=${tabLang}`)
              }}
              fields={[
                {
                  name: "name",
                  required: true,
                  value: isOwn ? get(item, 'name') : ''
                },
                {
                  name: "value",
                  value: isOwn ? get(item, 'value') : ''
                },
                {
                  name: "link",
                  value: get(item, 'link')
                },
                {
                  name: "slug",
                  value: get(item, 'slug'),
                  onSubmitValue: value => value ? value : null
                },
                {
                  name: "alias",
                  value: get(item, 'alias')
                },
                {
                  name: "photo",
                  value: get(item, 'files') ?  [get(item, 'files')] : [],
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
                include: ['translations', 'files'],
                extra: {_l: tabLang}
              }}
            >
              {({isSubmitting, values, setFieldValue}) => {
                return (
                  <Spin spinning={isSubmitting}>

                    <Form {...{values, lang, setFieldValue, isUpdate: true}}/>

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