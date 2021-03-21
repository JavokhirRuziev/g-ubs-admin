import React, {useState} from 'react';

import {Spin, Tabs} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './components/Form';
import {Panel} from "components";
import config from "config";

import qs from "query-string";
import {useTranslation} from "react-i18next";
const TabPane = Tabs.TabPane;

const Create = ({location, history}) => {
  const query = qs.parse(location.search);
  const {t} = useTranslation();
  let {lang} = query;
  const [tabLang, setTabLang] = useState(lang);
  const [saveType, setSaveType] = useState('list');


  return (
    <EntityForm.Main
      method="post"
      entity="locations"
      name={`locations`}
      url="/shops"
      prependData
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
          name: "title_uz",
        },
        {
          name: "title_ru",
        },
        {
          name: "title_en",
        },
        {
          name: "address_uz",
        },
        {
          name: "address_ru",
        },
        {
          name: "address_en",
        },
        {
          name: "destination_uz",
        },
        {
          name: "destination_ru",
        },
        {
          name: "destination_en",
        },
        {
          name: "lat",
          value: '41.345570',

        },
        {
          name: "long",
          value: '69.284599'
        },
        {
          name: "full_locations",
          disabled: true
        },
        {
          name: "phone",
        },
        {
          name: "status",
          value: true,
          onSubmitValue: value => value ? 1 : 0
        }
      ]}
    >
      {({isSubmitting, values, setFieldValue}) => {
        return (
          <Spin spinning={isSubmitting}>
            <div className="title-md mb-20 mt-14">{t('Создать локацию')}</div>
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
            <Form {...{values, setFieldValue, setSaveType, tabLang}}/>
          </Spin>
        );
      }}
    </EntityForm.Main>
  );
};

export default Create;