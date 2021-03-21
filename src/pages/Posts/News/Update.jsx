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
import moment from "moment";

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
      history.push(`/posts/update/${hasLangItem[0].id}?lang=${hasLangItem[0].lang}`)
    }
  };

  const isOwn = lang === tabLang;

  return (
    <EntityContainer.One
      entity="post"
      name={`posts-${id}`}
      url={`/post/${id}`}
      primaryKey="id"
      id={id}
      params={{
        include: "category,file",
      }}
    >
      {({item, isFetched}) => {
        return (
          <Spin spinning={!isFetched}>

            <div className="title-md mb-20 mt-14">{t('Изменить новость')}</div>
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
              entity="post"
              name={`posts-${tabLang}`}
              url={isOwn ? `/post/${get(item, 'id')}` : '/post'}
              updateData={isOwn}
              prependData={!isOwn}
              primaryKey="id"
              normalizeData={data => data}
              onSuccess={(data, resetForm) => {
                resetForm();
                if(saveType === 'list'){
                  history.push(`/posts?lang=${tabLang}`)
                }else if(saveType === 'update'){
                  history.push(`/posts/update/${get(data, 'id')}?lang=${tabLang}`)
                }else if(saveType === 'create'){
                  history.push(`/posts/create?lang=${tabLang}`)
                }
              }}
              fields={[
                {
                  name: "title",
                  required: true,
                  value: isOwn ? get(item, 'title') : ''
                },
                {
                  name: "content",
                  value: isOwn ? get(item, 'content', "") ? get(item, 'content', "") : '' : ''
                },
                {
                  name: "category_id",
                  value: get(item, 'category'),
                  onSubmitValue: value => value ? value.id : null
                },
                {
                  name: "publish_time",
                  value: moment(get(item, 'publish_time')),
                  onSubmitValue: value => (!!value ? moment(value).unix() : ""),
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
                  name: "top",
                  value: get(item, 'top') === 1,
                  onSubmitValue: value => value ? 1 : 0
                },
                {
                  name: "lang_hash",
                  value: get(item, 'lang_hash')
                },
                {
                  name: "type",
                  value: 1
                }
              ]}
              params={{
                include: ['category', 'file'],
                extra: {_l: tabLang}
              }}
            >
              {({isSubmitting, values, setFieldValue}) => {
                return (
                  <Spin spinning={isSubmitting}>

                    <Form {...{values, lang:tabLang, setFieldValue, isUpdate: true, isFetched, setSaveType}}/>

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
