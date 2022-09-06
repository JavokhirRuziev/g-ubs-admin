import React, {useState} from 'react';

import {Board, GridElements, LoadMoreVisible} from 'components';
import {AddButton, NavigationHelper, Search} from 'components/SmallComponents';
import EntityContainer from 'modules/entity/containers';
import {DefaultCard} from 'components/Cards';
import {Modal, Spin} from 'antd';
import Create from "pages/Handbook/ExpensesCategory/Create";
import Update from "pages/Handbook/ExpensesCategory/Update";

import {useTranslation} from "react-i18next";
import {useDebounce} from 'use-debounce';
import get from "lodash/get";

import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'
import {useHistory, useLocation} from "react-router";
import qs from "query-string";

const Customers = ({selectedCategory, setCategory}) => {
  const {t} = useTranslation();

  const [createModal, showCreateModal] = useState(false);
  const [updateModal, showUpdateModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [searchQuery] = useDebounce(query, 600);

  const history = useHistory();
  const location = useLocation();

  const setCategoryId = category => {
    const search = {category: category.id};

    history.push({
      search: qs.stringify(search)
    });
  };


  return (
    <GridElements.Column xs={3} gutter={10} className="Column">
      <div className="title-md mb-10">{t("Категории")}</div>
      <Board calc={160}>
        <div className="pad-10">
          <AddButton
            uppercase
            title={t("+ Добавить категорию")}
            handleClick={() => showCreateModal(true)}
            className="mb-10"
          />
          <div className='column__search mt-5'>
            <Search text={t("Поиск")} onSearch={setQuery} value={query} {...{setPage}} />
          </div>
          <Modal
            visible={createModal}
            onOk={() => showCreateModal(true)}
            onCancel={() => showCreateModal(false)}
            footer={null}
            centered
            width={430}
            destroyOnClose
          >
            <Create {...{showCreateModal}}/>
          </Modal>
          <Modal
            visible={updateModal}
            onOk={() => showUpdateModal(true)}
            onCancel={() => showUpdateModal(false)}
            footer={null}
            centered
            width={430}
            destroyOnClose
          >
            <Update {...{selected, showUpdateModal}}/>
          </Modal>
        </div>
        <EntityContainer.All
          entity="expense"
          name="all"
          url="/expense-categories"
          primaryKey="id"
          params={{
            page,
            sort: '-id',
            limit: 20,
            extra: {name: searchQuery}
          }}
          appendData
          onSuccess={data => {
            let items = data.data;
            let activeCategory = null;
            let {category} = qs.parse(location.search);
            if(category){
              activeCategory = items.find(c => c.id === Number(category));
              setCategory(activeCategory);
            }
          }}
        >
          {({items, isFetched, meta}) => {

            const menuList = [
              {
                title: t("Редактировать"),
                onClick: model => {
                  showUpdateModal(true);
                  setSelected(model);
                }
              }
            ];

            return (
              <PerfectScrollbar>
                <div className="items-list">
                  {items && items.map(category => (
                    <DefaultCard
                      key={get(category, 'id')}
                      model={category}
                      className={`title-bold pt-30 pb-30 mb-10 ${get(selectedCategory, 'id') === get(category, 'id') ? 'active' : ''}`}
                      title={get(category, 'title')}
                      onClick={() => {
                        if(get(selectedCategory, 'id') === get(category, 'id')){
                          setCategory(null);
                          history.push({
                            search: qs.stringify({})
                          });
                        }else{
                          setCategory(category);
                          setCategoryId(category)
                        }
                      }}
                      {...{menuList}}
                    />
                  ))}
                  {(isFetched && items.length < 1) && (
                    <NavigationHelper
                      className="mt-15 mb-15 fs-15"
                    />
                  )}
                  {!isFetched && (
                    <div className="d-flex justify-content-center">
                      <Spin/>
                    </div>
                  )}
                  {isFetched && meta && meta.currentPage < meta.pageCount && (
                    <LoadMoreVisible
                      setPage={() =>
                        setPage(meta.currentPage + 1)
                      }
                    />
                  )}
                </div>
              </PerfectScrollbar>
            );
          }}
        </EntityContainer.All>
      </Board>
    </GridElements.Column>
  );
};

export default Customers;
