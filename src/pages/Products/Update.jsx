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
    const hasLangItem = translations.filter(({ lang }) => lang === langCode);
    if (hasLangItem.length > 0) {
      history.push(`/product/update/${hasLangItem[0].id}?lang=${hasLangItem[0].lang}`)
    }
  };

  const isOwn = lang === tabLang;

  return (
    <EntityContainer.One
      entity="product"
      name={`products-${id}`}
      url={`/products/${id}`}
      primaryKey="id"
      id={id}
      params={{
        include: "category",
        extra: {append: 'palette0,documents0'}
      }}
    >
      {({item, isFetched}) => {
        return (
          <Spin spinning={!isFetched}>

            <div className="title-md mb-20 mt-14">{t('Изменить продукт')}</div>
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
              entity="product"
              name={`products-${tabLang}`}
              url={isOwn ? `/products/${get(item, 'id')}` : '/products'}
              updateData={isOwn}
              prependData={!isOwn}
              primaryKey="id"
              normalizeData={data => data}
              onSuccess={(data, resetForm) => {
                resetForm();
                if(saveType === 'list'){
                  history.push(`/products?lang=${tabLang}`)
                }else if(saveType === 'update'){
                  history.push(`/products/update/${get(data, 'id')}?lang=${tabLang}`)
                }else if(saveType === 'create'){
                  history.push(`/products/create?lang=${tabLang}`)
                }
              }}
              fields={[
                {
                  name: "color",
                  value: '#000000',
                  disabled:true
                },
                {
                  name: 'palette',
                  value: get(item, 'palette0'),
                  onSubmitValue: value => value.length > 0 ? value.reduce((prev,curr) => [...prev, {color: curr.color, files: curr.files.reduce((prev, curr) => [...prev,curr.id], [])}], []) : [],
                },
                {
                  name: "name",
                  required: true,
                  value: isOwn ? get(item, 'name') : ''
                },
                {
                  name: "body",
                  value: isOwn ? get(item, 'body', '') : ''
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
                  value: [],
                  onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
                },
                {
                  name: "paletteUpload",
                  value: [],
                  disabled: true
                },
                {
                  name: "file",
                  required: true,
                  value: get(item, 'file') ?  [get(item, 'file')] : [],
                  onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
                },
                {
                  name: "lang_hash",
                  value: get(item, 'lang_hash')
                }
              ]}
              params={{
                include: ['category'],
                extra: {append: 'palette0,documents0',_l: tabLang}
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
