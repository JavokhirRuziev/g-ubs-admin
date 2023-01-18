import React from 'react';

import {Board, GridElements} from 'components';
import {NavigationHelper} from 'components/SmallComponents';
import EntityContainer from 'modules/entity/containers';
import {DefaultCard} from 'components/Cards';
import {Spin} from 'antd';

import {useTranslation} from "react-i18next";
import get from "lodash/get";

import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'
import {useHistory, useLocation} from "react-router";
import qs from "query-string";
import config from "config";

const Customers = ({selectedCategory, setCategory}) => {
  const {t} = useTranslation("main");

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
          <EntityContainer.All
              entity="transaction-category"
              name="all-2"
              url="/expense-categories"
              primaryKey="id"
              params={{
                sort: 'title',
                limit: 20,
                filter: {
                  type: config.INCOME_CATEGORY_TYPE
                }
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

              return (
                  <PerfectScrollbar>
                    <div className="items-list pt-15">
                      <DefaultCard
                          className={`title-bold pt-30 pb-30 mb-10 ${!selectedCategory ? 'active' : ''}`}
                          title={"Барчаси"}
                          onClick={() => {
                            setCategory(null);
                            history.push({
                              search: qs.stringify({})
                            });
                          }}
                      />
                      {items && items.map(category => (
                          <DefaultCard
                              modelId={get(category, 'id')}
                              key={get(category, 'id')}
                              model={category}
                              className={`title-bold pt-30 pb-30 mb-10 ${get(selectedCategory, 'id') === get(category, 'id') ? 'active' : ''}`}
                              title={get(category, 'title')}
                              onClick={() => {
                                setCategory(category);
                                setCategoryId(category)
                              }}
                              onDelete={true}
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
