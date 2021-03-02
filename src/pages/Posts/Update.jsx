import React, {useState} from 'react';

import {Modal, Spin, Tabs} from 'antd';
import {Panel} from 'components';
import EntityForm from 'modules/entity/forms';
import EntityContainer from 'modules/entity/containers';
import Form from './components/Form';

import {useTranslation} from "react-i18next";
import qs from "query-string";
import get from "lodash/get";
import config from "config";
import moment from "moment";
import CreateTag from "./components/CreateTag";

const Update = ({location, history, match}) => {
  const TabPane = Tabs.TabPane;
  const {t} = useTranslation();

  const query = qs.parse(location.search);
  const {lang} = query;
  const {id} = match.params;

  const [tabLang, setTabLang] = useState(lang);
  const [saveType, setSaveType] = useState('list');
  const [tagField, setTagField] = useState(false);
  const [createModal, showCreateModal] = useState(false);

  const changeTab = (langCode, translations) => {
    const hasLangItem = translations.filter(({ lang }) => lang === langCode);
    if (hasLangItem.length > 0) {
      history.push(`/posts/update/${hasLangItem[0].id}?lang=${hasLangItem[0].lang}`)
    }
  };

  const isOwn = lang === tabLang;
  const openHandler = () => {
    showCreateModal(true);
    setTagField(false)
  };

  const closeHandler = () => {
    showCreateModal(false);
    setTagField(true)
  };

  return (
    <EntityContainer.One
      entity="post"
      name={`posts-${id}`}
      url={`/post/${id}`}
      primaryKey="id"
      id={id}
      params={{
        include: "category, translations, files, download_files, countries, documents, country, content, tags, embassies",
      }}
    >
      {({item, isFetched}) => {
        return (
          <Spin spinning={!isFetched}>

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
                  name: "description",
                  max: 500,
                  value: isOwn ? get(item, 'description') : ''
                },
                {
                  name: "content",
                  value: isOwn ? get(item, 'content') : ''
                },
                {
                  name: "top",
                  value: get(item, 'top')
                },
                {
                  name: "show_photo",
                  value: get(item, 'show_photo')
                },
                {
                  name: "countries",
                  value: get(item, 'countries', []),
                  onSubmitValue: value => value ? value.reduce((prev, curr) => [...prev, curr.id], []) : []
                },
                {
                  name: "type",
                  value: get(item, 'type'),
                  isAbsolute: true
                },
                {
                  name: "category_id",
                  value: get(item, 'category', []).reduce((prev, curr) => [...prev, curr.id], []),
                },
                {
                  name: "begin_publish_time",
                  onSubmitValue: value => (!!value ? moment(value).unix() : ""),
                  value: moment.unix(get(item, 'begin_publish_time', null)),
                  required: true
                },
                {
                  name: "files",
                  value: get(item, 'files') ?  get(item, 'files', []) : [],
                  onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
                },
                {
                  name: 'download_files',
                  value: Array.isArray(get(item,'download_files')) ? get(item,'download_files',[]) : [],
                  onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
                },
                {
                  name: "embassies",
                  value: isOwn ? get(item, 'embassies', []) : [],
                  onSubmitValue: value => value ? value.reduce((prev, curr) => [...prev, curr.id], []) : []
                },
                {
                  name: "photo_text",
                  value: get(item, 'photo_text')
                },
                {
                  name: "status",
                  value: get(item, 'status') === 1,
                  onSubmitValue: value => value ? 1 : 0
                },
                {
                  name: "tag_id",
                  onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []),
                  value: get(item, 'tags', [])
                },
                {
                  name: "doc_id",
                  value: get(item, 'documents', []),
                  onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], [])
                },
                {
                  name: "lang_hash",
                  value: get(item, 'lang_hash')
                }
              ]}
              params={{
                include: ['translations', 'category', 'files'],
                extra: {_l: tabLang}
              }}
            >
              {({isSubmitting, values, setFieldValue}) => {
                return (
                  <Spin spinning={isSubmitting}>

                    <Form {...{values, lang:tabLang, setFieldValue, isUpdate: true, isFetched, setSaveType, openHandler, tagField}}/>

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
