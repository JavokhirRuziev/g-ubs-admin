import React, {useState} from "react";

import {Tabs, Button, Spin} from "antd";
import {Board} from "components";
import {NavigationHelper} from 'components/SmallComponents';
import config from 'config';
import EntityContainer from "modules/entity/containers";
import EntitySchema from "modules/entity/schema";

import CreateModal from "./components/CreateItem";
import UpdateModal from "./components/UpdateItem";
import NestedList from "./components/NestedList";

import {useSelector} from "react-redux";
import qs from "query-string";
import get from "lodash/get";
import {useTranslation} from "react-i18next";

const TabPane = Tabs.TabPane;

const View = ({location, history, match}) => {

  const system = useSelector(state => state.system);
  const [selected, setSelected] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState({});

  const {alias} = match.params;

  const query = qs.parse(location.search);
  const {lang} = query;
  const langCode = useSelector(state => state.system.currentLangCode);
  const [tabLang, setTabLang] = useState(lang ? lang : langCode);

  const {t} = useTranslation();

  const openModal = name => {
    setModalVisible({
      ...modalVisible,
      [name]: true
    });
  };

  const closeModal = name => {
    setModalVisible({
      ...modalVisible,
      [name]: false
    });
  };

  const setActiveTab = activeTab => {
    setTabLang(activeTab);
    let query = qs.parse(location.search);
    query = {
      ...query,
      lang: activeTab
    };
    const search = qs.stringify(query);
    history.push({
      search
    });
  };

  return (
    <EntityContainer.One
      entity="menu"
      name="menu"
      primaryKey="id"
      url={`/menu/${alias}`}
      params={{
        extra: {
          _l: lang || system.language
        },
        include: "menuItems.files"
      }}
      relations={{
        menuItems: [EntitySchema("menuItem", "menu_item_id")]
      }}
    >
      {({item, isFetched}) => {
        return (
          <>
            <div className="d-flex justify-content-between align-items-center mb-20">
              <div className="title-md">{get(item, 'title')} </div>
              <Button
                type="primary"
                size="large"
                className="fs-14 fw-300 ml-10"
                htmlType="button"
                onClick={() => openModal("create")}
              >{t("Добавить")}</Button>
            </div>

            <CreateModal
              menu={item}
              name={alias}
              parent={selected}
              visible={!!modalVisible["create"]}
              onCancel={() => closeModal("create")}
              lang={tabLang}
            />
            <UpdateModal
              menu={item}
              item={selected}
              name={alias}
              visible={!!modalVisible["update"]}
              onCancel={() => closeModal("update")}
              lang={tabLang}
            />

            <Board className="border-none">
              <div>
                <Tabs
                  activeKey={tabLang}
                  onChange={value => setActiveTab(value)}
                  className="tabs--board-head"
                >
                  {config.API_LANGUAGES.map(item => (
                    <TabPane key={item.code} tab={t(item.title)}/>
                  ))}
                </Tabs>
              </div>
              <Spin spinning={!isFetched || isLoading}>
                {get(item, 'menuItems', []).length > 0 ? (
                  <div className="pad-20">
                    <NestedList
                      menu={item}
                      items={get(item, "menuItems", [])}
                      maxDepth={50}
                      entity="menuItem"
                      name={alias}
                      setLoading={setLoading}
                      onCreate={selected => {
                        setSelected(selected);
                        openModal("create");
                      }}
                      onUpdate={selected => {
                        setSelected(selected);
                        openModal("update");
                      }}
                    />
                  </div>
                ) : (
                  <div className="pad-20">
                    <NavigationHelper
                      text={t("Этого алиасе нет меню")}
                      className="mt-15 mb-15"
                    />
                  </div>
                )}
              </Spin>

            </Board>
          </>
        );
      }}
    </EntityContainer.One>
  );
};

export default View;
