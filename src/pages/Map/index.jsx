import React from 'react';

import {Board} from "components";
import {Button, Spin} from "antd";
import EntityForm from 'modules/entity/forms';
import EntityContainer from 'modules/entity/containers';

import {useSelector} from "react-redux";
import {
  YMaps,
  Map,
  Placemark,
  ZoomControl,
  FullscreenControl,
  GeolocationControl,
  SearchControl,
  TypeSelector
} from "react-yandex-maps";
import {useTranslation} from "react-i18next";
import get from "lodash/get";

const Index = () => {
  const langCode = useSelector(state => state.system.currentLangCode);
  const {t} = useTranslation();
  return (
    <Board className="pad-20">
      <EntityContainer.One
        entity="setting"
        name={`settings-${langCode}`}
        url={`/settings/map`}
        primaryKey="slug"
        id="map"
      >
        {({item, isFetched}) => {
          const value = get(item, 'value');
          return (
            <Spin spinning={!isFetched}>
              <EntityForm.Main
                method={value ? 'put' : 'post'}
                entity="setting"
                name={`settings-${langCode}`}
                url={value ? `/settings/${item.id}` : '/settings'}
                updateData={value}
                prependData={!value}
                primaryKey="id"
                normalizeData={data => data}
                onSuccess={(data, resetForm) => {}}
                fields={[
                  {
                    name: "name",
                    value: 'Карта',
                    required: true
                  },
                  {
                    name: "value",
                    value: value ? item.value : '41.311151/69.279737'
                  },
                  {
                    name: "slug",
                    value: "map"
                  },
                  {
                    name: "alias",
                    value: "map"
                  },
                  {
                    name: "status",
                    value: "1"
                  }
                ]}
              >
                {({isSubmitting, setFieldValue, values}) => {
                  const lat = Number(values.value.split('/')[0]);
                  const long = Number(values.value.split('/')[1]);

                  return (
                    <Spin spinning={isSubmitting}>
                      <YMaps>
                        <div
                          style={{display: "flex", flexDirection: "column"}}
                          className="ant-row ant-form-item">
                          <div className="ant-label mb-20">{t("Место нахождения")}</div>
                          <div className="warehouse__map">
                            <Map
                              style={{width: "100%", height: 570}}
                              defaultState={{
                                center: [lat, long],
                                zoom: 6,
                                controls: []
                              }}>
                              <FullscreenControl/>
                              <ZoomControl options={{float: "right"}}/>
                              <GeolocationControl options={{float: "left"}}/>
                              <SearchControl options={{float: "right"}}/>
                              <TypeSelector options={{float: "right"}}/>
                              <Placemark
                                options={{useMapMarginInDragging: true, draggable: true}}
                                geometry={[lat, long]}
                                modules={["geoObject.addon.balloon", "geoObject.addon.hint"]}
                                properties={{hintContent: t("Место нахождения")}}
                                onDragEnd={e => {
                                  const coordinates = e.get("target").geometry.getCoordinates();
                                  const [latitude, longitude] = coordinates;
                                  setFieldValue("value", `${latitude}/${longitude}`);
                                }}
                              />
                            </Map>
                          </div>
                        </div>
                      </YMaps>
                      <Button
                        type="primary"
                        size="large"
                        className="fs-14 fw-300"
                        htmlType="submit"
                      >{t("Сохранить")}</Button>
                    </Spin>
                  );
                }}
              </EntityForm.Main>
            </Spin>
          )
        }}
      </EntityContainer.One>
    </Board>
  );
};

export default Index;