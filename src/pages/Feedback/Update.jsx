import React from 'react';

import {Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import EntityContainer from 'modules/entity/containers';
import Form from './components/Form';

import {useTranslation} from "react-i18next";
import get from "lodash/get";
import {helpers} from "services";

const Update = ({history, match}) => {
  const {t} = useTranslation();
  const {id} = match.params;

  return (
    <EntityContainer.One
      entity="feedback"
      name={"feedback"}
      url={`/feedback/${id}`}
      primaryKey="id"
      id={id}
    >
      {({item, isFetched}) => {
        return (
          <Spin spinning={!isFetched}>
            <div className="title-md mb-20 mt-14">{t('Изменить заявку')}</div>

            <EntityForm.Main
              method={'put'}
              entity="feedback"
              name={"feedback"}
              url={`/feedback/${get(item, 'id')}`}
              updateData={true}
              prependData={false}
              primaryKey="id"
              normalizeData={data => data}
              onSuccess={(data, resetForm) => {
                resetForm();
                history.push(`/feedback`)
              }}
              fields={[
                {
                  name: "name",
                  value: get(item, 'name')
                },
                {
                  name: "phone",
                  value: get(item, 'phone')
                },
                {
                  name: "email",
                  value: get(item, 'email')
                },
                {
                  name: "text",
                  value: get(item, 'text')
                },
                {
                  name: "type",
                  value: helpers.feedbackLabel(get(item, 'type')),
                  isAbsolute: true
                },
                {
                  name: "status",
                  value: get(item, 'status') === 1,
                  onSubmitValue: value => value ? 1 : 0
                },
              ]}
            >
              {({isSubmitting, values, setFieldValue}) => {
                return (
                  <Spin spinning={isSubmitting}>

                    <Form {...{values, setFieldValue, isUpdate: true, isFetched}}/>

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
