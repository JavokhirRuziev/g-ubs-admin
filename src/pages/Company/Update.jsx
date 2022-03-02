import React, {useState} from 'react';

import {Spin, Tabs} from 'antd';
import {Board, Panel} from 'components';
import EntityForm from 'modules/entity/forms';
import EntityContainer from 'modules/entity/containers';
import Form from './components/Form';
import Schedule from "./components/Schedule";

import {useTranslation} from "react-i18next";
import qs from "query-string";
import get from "lodash/get";
import config from "config";
import {useSelector} from "react-redux";

const Update = ({location, history}) => {
  const TabPane = Tabs.TabPane;
  const {t} = useTranslation();

  const query = qs.parse(location.search);
  const {lang} = query;
  const profile = useSelector(state => state.auth.data.success);
  const id = get(profile, 'company_id');

  const [tabLang, setTabLang] = useState(lang || 'ru');

  const changeTab = (value) => {
    history.push(`/profile/company?lang=${value}`)
  };

  return (
    <EntityContainer.One
      entity="company"
      name={`company-${id}`}
      url={`/companies/${id}`}
      primaryKey="id"
      id={id}
      params={{
        include: "translate,workingTimes,categories",
        extra: {_l: tabLang, append: 'gallery0'}
      }}
    >
      {({item, isFetched}) => {
        return (
          <Spin spinning={!isFetched}>
            <div className="title-md mb-20 mt-14">{t('Изменить компанию')}</div>
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
              entity="company"
              name={`all-${tabLang}`}
              url={`/companies/${get(item, 'id')}`}
              updateData={true}
              primaryKey="id"
              normalizeData={data => data}
              onSuccess={(data, resetForm) => {
              }}
              fields={[
                {
                  name: "tip",
                  value: get(item, 'tip'),
                  required: true,
                  type: 'number',
                },
                {
                  name: "file_id",
                  value: get(item, 'file') ? [get(item, 'file')] : [],
                  onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
                },
                {
                  name: "gallery",
                  value: get(item, 'gallery0') ? get(item, 'gallery0') : [],
                  onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
                },
                {
                  name: "latitude",
                  value: get(item, 'latitude') ? get(item, 'latitude') : '41.3137234',
                  onSubmitValue: value => value && String(value)
                },
                {
                  name: "longitude",
                  value: get(item, 'longitude') ? get(item, 'longitude') : '69.2396271',
                  onSubmitValue: value => value && String(value)
                },
                {
                  name: "status",
                  value: get(item, 'status') === 1,
                  onSubmitValue: value => value ? 1 : 0
                },
                {
                  name: "has_delivery",
                  value: get(item, 'has_delivery') === 1,
                  onSubmitValue: value => value ? 1 : 0
                },
                {
                  name: "has_takeaway",
                  value: get(item, 'has_takeaway') === 1,
                  onSubmitValue: value => value ? 1 : 0
                },
                {
                  name: "has_booking",
                  value: get(item, 'has_booking') === 1,
                  onSubmitValue: value => value ? 1 : 0
                },
                {
                  name: "table_order",
                  value: get(item, 'table_order') === 1,
                  onSubmitValue: value => value ? 1 : 0
                },
                {
                  name: "name",
                  required: true,
                  value: get(item, 'translate.name', "")
                },
                {
                  name: "address",
                  required: true,
                  value: get(item, 'translate.address', "")
                },
                {
                  name: "working_times",
                  value: get(item, 'working_times')
                },
                {
                  name: "description",
                  required: true,
                  value: get(item, 'translate.description', "")
                },
                {
                  name: "categories",
                  value: get(item, 'categories') ? get(item, 'categories', []) : [],
                  onSubmitValue: value => value.reduce((prev,curr) => [...prev, curr.id], []),
                  required: true
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

                    <Form {...{values, lang, setFieldValue, isUpdate: true}}/>

                  </Spin>
                );
              }}
            </EntityForm.Main>

            <Board>
              <Schedule schedule={get(item, 'working_times', [])}/>
            </Board>

          </Spin>
        )
      }}
    </EntityContainer.One>
  );
};

export default Update;