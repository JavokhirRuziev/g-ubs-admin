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

  const changeTab = (value) => {
    history.push(`/dishes/update/${id}?lang=${value}`)
  };

  return (
    <EntityContainer.One
      entity="dishes"
      name={`dishes-${id}`}
      url={`/dishes/${id}`}
      primaryKey="id"
      id={id}
      params={{
        include: "translate,file,video,company",
        extra: {_l: tabLang, append: 'gallery0'}
      }}
    >
      {({item, isFetched}) => {
        return (
          <Spin spinning={!isFetched}>
            <div className="title-md mb-20 mt-14">{t('Изменить еду')}</div>
            <Panel className="pad-0 mb-30">
              <Tabs
                activeKey={tabLang}
                onChange={value => {
                  setTabLang(value);
                  changeTab(value);
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
              method='put'
              entity="dishes"
              name={`all-${tabLang}`}
              url={`/dishes/${get(item, 'id')}`}
              updateData={true}
              primaryKey="id"
              normalizeData={data => data}
              onSuccess={(data, resetForm) => {
                resetForm();
                history.push(`/dishes?lang=${tabLang}`)
              }}
              fields={[
                {
                  name: "company_id",
                  value: get(item, 'company', null),
                  onSubmitValue: value => value ? value.id : null
                },
                {
                  name: "price",
                  value: get(item, 'price'),
                  required: true,
                  type: 'number',
                },
                {
                  name: "file_id",
                  value: get(item, 'file') ? [get(item, 'file')] : [],
                  onSubmitValue: value => value.length > 0 ? value[0].id : null
                },
                {
                  name: "video_id",
                  value: get(item, 'video') ? [get(item, 'video')] : [],
                  onSubmitValue: value => value.length > 0 ? value[0].id : null
                },
                {
                  name: "gallery",
                  value: get(item, 'gallery0') ? get(item, 'gallery0') : [],
                  onSubmitValue: value => value.length > 0 ? value.reduce((prev, curr) => [...prev, curr.id], []).join(",") : null
                },
                {
                  name: "status",
                  value: get(item, 'status') === 1,
                  onSubmitValue: value => value ? 1 : 0
                },
                {
                  name: "name",
                  required: true,
                  value: get(item, 'translate.name', "-")
                },
                {
                  name: "description",
                  required: true,
                  value: get(item, 'translate.description', "-")
                }
              ]}
              params={{
                include: "translate",
                extra: {_l: tabLang}
              }}
            >
              {({isSubmitting, values, setFieldValue}) => {
                return (
                  <Spin spinning={isSubmitting}>

                    <Form {...{values, lang: tabLang, setFieldValue, isUpdate: true}}/>

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