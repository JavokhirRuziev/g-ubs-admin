import React from 'react';

import {Fields, GridElements, Panel} from "components";
import {Field} from "formik";
import {Button, Switch} from "antd";
import Ingredients from "./Ingredients";

import {useTranslation} from "react-i18next";
// import get from "lodash/get";

const Form = ({isUpdate, setFieldValue, values, lang}) => {

    const {t} = useTranslation();

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
                        component={Fields.AntInput}
                        name="price"
                        type="text"
                        placeholder={t("Введите цену")}
                        label={t("Цена")}
                        size="large"
                    />
                    {/*<Field*/}
                    {/*    component={Fields.AsyncSelect}*/}
                    {/*    name="company_id"*/}
                    {/*    placeholder={t("Компания")}*/}
                    {/*    isClearable={true}*/}
                    {/*    loadOptionsUrl="/companies"*/}
                    {/*    label={t("Компания")}*/}
                    {/*    loadOptionsParams={(search) => {*/}
                    {/*        return{*/}
                    {/*            extra: {_l: lang}*/}
                    {/*        }*/}
                    {/*    }}*/}
                    {/*    optionLabel={option => get(option, 'translate.name')}*/}
                    {/*/>*/}

                    {isUpdate && (
                        <Ingredients/>
                    )}
                </Panel>
            </GridElements.Column>
            <GridElements.Column xs={4} gutter={10}>
                <Panel>
                    <Field
                        component={Fields.UploadImageManager}
                        name="file_id"
                        label={t("Фото")}
                        size="large"
                        className={"mb-14"}
                    />
                    <Field
                        component={Fields.UploadImageManager}
                        name="video_id"
                        label={t("Видео")}
                        size="large"
                        className={"mb-14"}
                        isDocument={true}
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