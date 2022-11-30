import React from 'react';

import {Fields, GridElements, Panel} from "components";
import {Field} from "formik";
import {Button, Switch} from "antd";

import {useTranslation} from "react-i18next";
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

const Form = ({isUpdate, setFieldValue, values}) => {

    const {t} = useTranslation("main");

    return (
        <GridElements.Row gutter={10} className={"mb-30"}>
            <GridElements.Column xs={8} gutter={10}>
                <Panel>
                    <Field
                        component={Fields.AntInput}
                        name="name"
                        type="text"
                        placeholder={t("Введите названию")}
                        label={t("Названия")}
                        size="large"
                    />
                    <Field
                        component={Fields.AntTextarea}
                        name="description"
                        type="text"
                        rows={5}
                        label={t("Описания")}
                        placeholder={t("Введите описания")}
                    />
                    <Field
                        component={Fields.AntTextarea}
                        name="address"
                        type="text"
                        rows={5}
                        label={t("Адрес")}
                        placeholder={t("Введите адрес")}
                    />
                    <YMaps>
                        <div
                            style={{display: "flex", flexDirection: "column"}}
                            className="ant-row ant-form-item">
                            <div className="ant-label">{t("Место нахождения")}</div>
                            <div className="warehouse__map">
                                <Map
                                    style={{width: "100%", height: 270}}
                                    defaultState={{
                                        center: [values.latitude, values.longitude],
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
                                        geometry={[values.latitude, values.longitude]}
                                        modules={["geoObject.addon.balloon", "geoObject.addon.hint"]}
                                        properties={{hintContent: t("Место нахождения")}}
                                        onDragEnd={e => {
                                            const coordinates = e.get("target").geometry.getCoordinates();
                                            const [latitude, longitude] = coordinates;
                                            setFieldValue("latitude", latitude);
                                            setFieldValue("longitude", longitude);
                                        }}
                                    />
                                </Map>
                            </div>
                        </div>
                    </YMaps>
                </Panel>
            </GridElements.Column>
            <GridElements.Column xs={4} gutter={10}>
                <Panel>
                    <Field
                        component={Fields.AntInput}
                        name="tip"
                        type="text"
                        placeholder={t("Введите названию")}
                        label={t("% Обслуживание в заведении")}
                        size="large"
                    />
                    <Field
                        component={Fields.UploadImageManager}
                        name="file_id"
                        label={t("Фото")}
                        size="large"
                        className={"mb-14"}
                    />
                    <Field
                        component={Fields.UploadImageManager}
                        name="gallery"
                        label={t("Галерея")}
                        size="large"
                        className={"mb-14"}
                        isMulti={true}
                        limit={10}
                    />
                    <div className="d-flex align-items-center mb-24">
                        <Switch
                            onChange={value => {
                                setFieldValue('status', value)
                            }}
                            checked={values.status}
                        />
                        <div className="ant-label mb-0 ml-10">{t('Активный статус')}</div>
                    </div>

                    <Button
                        type="primary"
                        size="large"
                        className="fs-14 fw-300"
                        htmlType="submit"
                    >{isUpdate ? t("Сохранить") : t("Создать")}</Button>
                </Panel>
            </GridElements.Column>
        </GridElements.Row>
    );
};

export default Form;