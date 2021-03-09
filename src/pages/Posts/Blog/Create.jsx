import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './components/Form';

import {useTranslation} from "react-i18next";
import qs from "query-string";
import get from "lodash/get";
import {useHistory, useLocation} from "react-router";
import moment from "moment";

const Create = () => {
  const {t} = useTranslation();
  const location = useLocation();
  const history = useHistory();

  const query = qs.parse(location.search);
  const {lang} = query;

  return (
    <>
      <EntityForm.Main
        method="post"
        entity="post"
        name={`blogs-${lang}`}
        url="/post"
        prependData
        primaryKey="id"
        normalizeData={data => data}
        onSuccess={(data, resetForm) => {
          resetForm();
          history.push(`/blogs/update/${get(data, 'id')}?lang=${lang}`)
        }}
        fields={[
          {
            name: "title",
            required: true
          },
          {
            name: "content",
            value: ""
          },
          {
            name: "category_id",
            onSubmitValue: value => value ? value.id : null
          },
          {
            name: "publish_time",
            value: moment(),
            onSubmitValue: value => (!!value ? moment(value).unix() : ""),
          },
          {
            name: "file",
            value: [],
            onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
          },
          {
            name: "status",
            value: true,
            onSubmitValue: value => value ? 1 : 0
          },
          {
            name: "top",
            value: false,
            onSubmitValue: value => value ? 1 : 0
          },
          {
            name: "type",
            value: 2
          }
        ]}
        params={{
          include: "category, files",
          extra: {_l: lang}
        }}
      >
        {({isSubmitting, values, setFieldValue}) => {
          return (
            <Spin spinning={isSubmitting}>
              <div className="title-md mb-20 mt-14">{t('Создать блог')}</div>
              <Form {...{values, lang, setFieldValue, isFetched: true, isUpdate: false}}/>
            </Spin>
          );
        }}
      </EntityForm.Main>
    </>
  );
};

export default Create;
