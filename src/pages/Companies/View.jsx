import React, {useState} from 'react';

import {Spin, Tabs} from 'antd';
import {Panel} from 'components';
import EntityContainer from 'modules/entity/containers';

import {useTranslation} from "react-i18next";
import qs from "query-string";
import get from "lodash/get";
import config from "config";
import {
    FullscreenControl,
    GeolocationControl,
    Map,
    Placemark,
    SearchControl,
    TypeSelector, YMaps,
    ZoomControl
} from "react-yandex-maps";

const View = ({location, history, match}) => {
    const TabPane = Tabs.TabPane;
    const {t} = useTranslation();

    const query = qs.parse(location.search);
    const {lang} = query;
    const {id} = match.params;

    const [tabLang, setTabLang] = useState(lang);

    const changeTab = (value) => {
        history.push(`/companies/view/${id}?lang=${value}`)
    };

    return (
        <EntityContainer.One
            entity="company"
            name={`company-${id}`}
            url={`/companies/${id}`}
            primaryKey="id"
            id={id}
            params={{
                include: "translate",
                extra: {_l: tabLang, append: 'gallery0'}
            }}
        >
            {({item, isFetched}) => {
                const lat = get(item, 'latitude')
                const long = get(item, 'longitude')

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

                        <div className="row">
                            <div className="col-8">
                                <Panel>

                                    <div className="info-col">
                                        <div className="info-col__label">Названия</div>
                                        <div className="info-col__value">{get(item, 'translate.name')}</div>
                                    </div>

                                    <div className="info-col">
                                        <div className="info-col__label">Описания</div>
                                        <div className="info-col__value">{get(item, 'translate.description')}</div>
                                    </div>

                                    <div className="info-col">
                                        <div className="info-col__label">Адрес</div>
                                        <div className="info-col__value">{get(item, 'translate.address')}</div>
                                    </div>

                                    <YMaps>
                                        <div
                                            style={{display: "flex", flexDirection: "column"}}
                                            className="ant-row ant-form-item">
                                            <div className="ant-label">{t("Место нахождения")}</div>
                                            <div className="warehouse__map">
                                                <Map
                                                    style={{width: "100%", height: 270}}
                                                    defaultState={{
                                                        center: [lat, long],
                                                        zoom: 14,
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
                                                    />
                                                </Map>
                                            </div>
                                        </div>
                                    </YMaps>

                                </Panel>
                            </div>
                            <div className="col-4">
                                <Panel>
                                    <div className="info-row">
                                        <div className="ant-label mb-0">Обслуживание в заведении: </div>
                                        <div className="pl-10">{get(item, 'tip')} %</div>
                                    </div>

                                    <div className="info-col">
                                        <div className="info-col__label">Фото</div>
                                        <div className="info-col__value">
                                            <img src={get(item, 'file.thumbnails.small.src')} alt=""/>
                                        </div>
                                    </div>
                                </Panel>
                            </div>
                        </div>


                    </Spin>
                )
            }}
        </EntityContainer.One>
    );
};

export default View;