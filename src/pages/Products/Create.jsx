import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './components/Form';

import {useTranslation} from "react-i18next";
import get from "lodash/get";
import {useHistory} from "react-router";

const Create = () => {
  const {t} = useTranslation();
  const history = useHistory();

  return (
    <>
      <EntityForm.Main
        method="post"
        entity="product"
        name={`products`}
        url="/products"
        prependData
        primaryKey="id"
        normalizeData={data => data}
        onSuccess={(data, resetForm) => {
          resetForm();
          history.push(`/products/update/${get(data, 'id')}`)
        }}
        fields={[
          {
            name: "color",
            value: '#000000',
            disabled:true
          },
          {
            name: 'palette',
            value: [],
            onSubmitValue: value => value.length > 0 ? value.reduce((prev,curr) => [...prev, {color: curr.color, files: curr.files.reduce((prev, curr) => [...prev,curr.id], [])}], []) : [],
          },
          {
            name: "name_uz",
          },
          {
            name: "name_ru",
            required: true
          },
          {
            name: "name_en",
          },
          {
            name: "body_uz",
            value: ""
          },
          {
            name: "body_ru",
            value: ""
          },
          {
            name: "body_en",
            value: ""
          },
          {
            name: "category_id",
            onSubmitValue: value => value ? value.id : null
          },
          {
            name: "documents",
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
            name: "price",
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
            value: [],
            onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
          },
          {
            name: 'posts',
            value: [],
            onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], [])
          }
        ]}
        params={{
          include: "category",
          extra: {append: 'palette0,documents0',}
        }}
      >
        {({isSubmitting, values, setFieldValue}) => {
          return (
            <Spin spinning={isSubmitting}>
              <div className="title-md mb-20 mt-14">{t('Создать продукт')}</div>
              <Form {...{values, lang: "ru", setFieldValue, isFetched: true, isUpdate: false}}/>
            </Spin>
          );
        }}
      </EntityForm.Main>
    </>
  );
};

export default Create;
