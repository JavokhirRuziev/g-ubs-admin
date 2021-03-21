import React, {useState} from 'react';
import {Spin, Tabs} from 'antd';
import EntityForm from 'modules/entity/forms';
import EntityContainer from 'modules/entity/containers';
import Form from './components/Form';
import {useTranslation} from "react-i18next";
import qs from "query-string";
import get from "lodash/get";
import {Panel} from "components";
import config from "config";

const TabPane = Tabs.TabPane;

const Update = ({location, history, match}) => {
  const query = qs.parse(location.search);
  const {t} = useTranslation();
  const { id } = match.params;

  let {lang} = query;
  const [tabLang, setTabLang] = useState(lang);
  const [saveType, setSaveType] = useState('list');

  return (
    <EntityContainer.One
      entity="locations"
      name={`locations-${id}`}
      url={`/shops/${id}`}
      primaryKey="id"
      id={id}
    >
      {({item, isFetched}) => {
        return (
          <Spin spinning={!isFetched}>
            <div className="title-md mb-20 mt-14">{t('Изменить локацию')}</div>
            <Panel className="pad-0 mb-30">
              <Tabs
                  activeKey={tabLang}
                  onChange={value => {
                    setTabLang(value);
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
              method={'put'}
              entity="locations"
              name={`locations`}
              url={`/shops/${get(item, 'id')}`}
              updateData
              primaryKey="id"
              normalizeData={data => data}
              onSuccess={(data, resetForm) => {
                resetForm();
                if(saveType === 'list'){
                  history.push(`/locations`)
                }else if(saveType === 'update'){
                  history.push(`/locations/update/${data.id}?lang=${tabLang}`)
                }else if(saveType === 'create'){
                  history.push(`/locations/create?lang=${tabLang}`)
                }
              }}
              fields={[
                {
                  name: "id",
                  value: get(item, 'id'),
                  disabled: true
                },
                {
                  name: "title_uz",
                  value: get(item, 'title_uz')
                },
                {
                  name: "title_ru",
                  value: get(item, 'title_ru')
                },
                {
                  name: "title_en",
                  value: get(item, 'title_en')
                },
                {
                  name: "destination_uz",
                  value: get(item, 'destination_uz')
                },
                {
                  name: "destination_ru",
                  value: get(item, 'destination_ru')
                },
                {
                  name: "destination_en",
                  value: get(item, 'destination_en')
                },
                {
                  name: "address_uz",
                  value: get(item, 'address_uz')
                },
                {
                  name: "address_ru",
                  value: get(item, 'address_ru')
                },
                {
                  name: "address_en",
                  value: get(item, 'address_en')
                },
                {
                  name: "phone",
                  value: get(item, 'phone')
                },
                {
                  name: "lat",
                  value: get(item, 'lat')
                },
                {
                  name: "long",
                  value: get(item, 'long')
                },
                {
                  name: "full_locations",
                  value: item && `${get(item, 'lat')},${get(item, 'long')}`,
                  disabled: true
                },
                {
                  name: "status",
                  value: get(item, 'status') === 1,
                  onSubmitValue: value => value ? 1 : 0
                }
              ]}
            >
              {({isSubmitting, values, setFieldValue}) => {
                return (
                  <Spin spinning={isSubmitting}>
                    <Form {...{values, setFieldValue, isUpdate: true, tabLang, setSaveType}}/>
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