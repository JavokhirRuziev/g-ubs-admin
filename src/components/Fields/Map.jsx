import React from 'react';
import {
    FullscreenControl,
    GeolocationControl,
    Map, Placemark,
    SearchControl,
    TypeSelector,
    YMaps,
    ZoomControl
} from "react-yandex-maps";
import {useTranslation} from "react-i18next";
import get from 'lodash/get';
import iconImage from 'assets/images/icons/location.svg';
import EntityContainer from "../../modules/entity/containers";
import {useSelector} from "react-redux";

const Index = ({setFieldValue, values}) => {

    const langCode = useSelector(state => state.system.currentLangCode);
    let lat = get(values, 'lat') ? get(values, "lat") : 41.345570;
    let long = get(values, 'long') ? get(values, 'long') : 69.284599;
    const {t} = useTranslation("main");

    return (
        <div className="map-block">
            <EntityContainer.All
                entity="locations"
                name={`locations`}
                url="/shops"
                primaryKey="id"
                params={{
                    sort: '-id',
                    limit: 100,
                    page: 1
                }}
            >
                {({items, isFetched, meta}) => {
                    let locations = items.filter(item => item.id !== get(values, 'id'));
                    return (
                        <YMaps>
                            <div
                                style={{display: "flex", flexDirection: "column"}}
                                className="ant-row ant-form-item">
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
                                                setFieldValue("lat", `${latitude}`);
                                                setFieldValue("long", `${longitude}`);
                                            }}
                                        />
                                        {isFetched && items.length > 0 && (
                                            <>
                                                {locations.map((location, key) => (
                                                    <Placemark
                                                        key={key}
                                                        geometry={[get(location, 'lat'), get(location, 'long')]}
                                                        properties={{
                                                            hintContent: get(location, `title_${langCode}`),
                                                            balloonContent: get(location, `title_${langCode}`)
                                                        }}
                                                        options={{
                                                            iconLayout: 'default#image',
                                                            iconImageHref: iconImage,
                                                            iconImageSize: [30, 30],
                                                            iconImageOffset: [-14, -30]
                                                        }}
                                                    />
                                                ))
                                                }
                                            </>
                                        )}
                                    </Map>
                                </div>
                            </div>
                        </YMaps>
                    );
                }}
            </EntityContainer.All>

        </div>
    );
};

export default Index;
