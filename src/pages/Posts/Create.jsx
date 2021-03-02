import React, {useState} from 'react';

import {Modal, Spin} from 'antd';
import EntityForm from 'modules/entity/forms';
import Form from './components/Form';
import CreateTag from "./components/CreateTag";

import {useTranslation} from "react-i18next";
import qs from "query-string";
import moment from "moment";
import get from "lodash/get";
import {useHistory, useLocation} from "react-router";

const Create = () => {
  const {t} = useTranslation();
  const location = useLocation();
  const history = useHistory();

  const query = qs.parse(location.search);
  const {lang} = query;
  const [tagField, setTagField] = useState(false);
  const [createModal, showCreateModal] = useState(false);

  const openHandler = () => {
    showCreateModal(true);
    setTagField(false)
  };

  const closeHandler = () => {
    showCreateModal(false);
    setTagField(true)
  };

  return (
    <>
      <Modal
        visible={createModal}
        onOk={() => openHandler()}
        onCancel={() => closeHandler()}
        footer={null}
        centered
        width={430}
        destroyOnClose
      >
        <CreateTag {...{closeHandler}}/>
      </Modal>
      <EntityForm.Main
        method="post"
        entity="post"
        name={`posts-${lang}`}
        url="/post"
        prependData
        primaryKey="id"
        normalizeData={data => data}
        onSuccess={(data, resetForm) => {
          resetForm();
          history.push(`/posts/update/${get(data, 'id')}?lang=${lang}`)
        }}
        fields={[
          {
            name: "title",
            required: true
          },
          {
            name: "description",
            max: 500
          },
          {
            name: "content",
            value: ""
          },
          {
            name: "top"
          },
          {
            name: "show_photo",
            value: 1
          },
          {
            name: "type",
            value: 4,
            isAbsolute: true
          },
          {
            name: "category_id",
          },
          {
            name: "countries",
            onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], [])
          },
          {
            name: "begin_publish_time",
            onSubmitValue: value => (!!value ? moment(value).unix() : ""),
            value: moment(),
            required: true
          },
          {
            name: "files",
            value: [],
            onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
          },
          {
            name: "download_files",
            value: [],
            onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
          },
          {
            name: "embassies",
            value: [],
            onSubmitValue: value => value ? value.reduce((prev, curr) => [...prev, curr.id], []) : []
          },
          {
            name: "photo_text",
          },
          {
            name: "doc_id",
            value: [],
            onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], [])
          },
          {
            name: "status",
            value: true,
            onSubmitValue: value => value ? 1 : 0
          },
          {
            name: "tag_id",
            onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], [])
          }
        ]}
        params={{
          include: "category, translations, files, embassies",
          extra: {_l: lang}
        }}
      >
        {({isSubmitting, values, setFieldValue}) => {
          return (
            <Spin spinning={isSubmitting}>
              <div className="title-md mb-20 mt-14">{t('Создать новость')}</div>
              <Form {...{values, lang, setFieldValue, isFetched: true, openHandler, tagField}}/>
            </Spin>
          );
        }}
      </EntityForm.Main>
    </>
  );
};

export default Create;
