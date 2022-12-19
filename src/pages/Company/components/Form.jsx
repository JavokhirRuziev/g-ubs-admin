import React from 'react';

import {Fields, Panel} from "components";
import {Field} from "formik";
import {Button, Switch} from "antd";
import get from "lodash/get";

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
        <div>
            <div className="row">
                <div className="col-xl-8 col-md-12">
                    <Panel className="mb-20">
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

                        <div className="row">
                            <div className="col-6">
                                <Field
                                    component={Fields.AsyncSelect}
                                    name="region_id"
                                    placeholder={t("Регион")}
                                    isClearable={true}
                                    loadOptionsUrl="/regions"
                                    className={"mb-24"}
                                    label={t("Регион")}
                                    optionLabel={"name_ru"}
                                />
                            </div>
                            <div className="col-6">
                                <Field
                                    component={Fields.AsyncSelect}
                                    name="district_id"
                                    placeholder={t("Район")}
                                    isClearable={true}
                                    loadOptionsUrl="/districts"
                                    className={"mb-24"}
                                    label={t("Район")}
                                    isDisabled={!get(values, 'region_id')}
                                    optionLabel={"name_ru"}
                                    filterParams={{
                                        region_id: get(values, 'region_id.id')
                                    }}
                                />
                            </div>
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
                </div>
                <div className="col-xl-4 col-md-12">
                    <Panel className="mb-20">
                        <Field
                            component={Fields.AsyncSelect}
                            name="categories"
                            placeholder={t("Категория")}
                            isClearable={true}
                            loadOptionsUrl="/categories"
                            className={"mb-24"}
                            label={t("Категория")}
                            optionLabel={"title_ru"}
                            isMulti={true}
                        />
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
                            name="logo_id"
                            label={t("Логотип для чека")}
                            size="large"
                            className={"mb-14"}
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

                        <div className="d-flex align-items-center mb-24">
                            <Switch
                                onChange={value => {
                                    setFieldValue('random_waiter', value)
                                }}
                                checked={values.random_waiter}
                            />
                            <div className="ant-label mb-0 ml-10">{t('Рандом официант')}</div>
                        </div>

                        <div className="d-flex align-items-center mb-24">
                            <Switch
                                onChange={value => {
                                    setFieldValue('has_delivery', value)
                                }}
                                checked={values.has_delivery}
                            />
                            <div className="ant-label mb-0 ml-10">{t('Доставка')}</div>
                        </div>

                        {values.has_delivery && (
                            <Field
                                component={Fields.AntInput}
                                name="delivery_price"
                                type="text"
                                placeholder={t("Введите сумму доставку")}
                                label={t("Цена за доставку")}
                                size="large"
                            />
                        )}


                        <div className="d-flex align-items-center mb-24">
                            <Switch
                                onChange={value => {
                                    setFieldValue('has_takeaway', value)
                                }}
                                checked={values.has_takeaway}
                            />
                            <div className="ant-label mb-0 ml-10">{t('На вынос')}</div>
                        </div>

                        <div className="d-flex align-items-center mb-24">
                            <Switch
                                onChange={value => {
                                    setFieldValue('table_order', value)
                                }}
                                checked={values.table_order}
                            />
                            <div className="ant-label mb-0 ml-10">{t('На стол')}</div>
                        </div>

                        <div className="d-flex align-items-center mb-24">
                            <Switch
                                onChange={value => {
                                    setFieldValue('has_booking', value)
                                }}
                                checked={values.has_booking}
                            />
                            <div className="ant-label mb-0 ml-10">{t('Забронировать')}</div>
                        </div>

                        <Button
                            type="primary"
                            size="large"
                            className="fs-14 fw-300"
                            htmlType="submit"
                        >{isUpdate ? t("Сохранить") : t("Создать")}</Button>
                    </Panel>
                </div>
            </div>
        </div>
    );
};

export default Form;