import React, {Fragment, useState} from 'react';

import {Fields, GridElements, Panel, Ckeditor} from "components";
import {Field} from "formik";
import {Button, Switch, Tabs} from "antd";

import {useTranslation} from "react-i18next";
import {ReactComponent as PlusIcon} from "assets/images/icons/plus.svg";
import {useHistory} from "react-router";
import { ChromePicker } from "react-color";
import styled from "styled-components";

const { TabPane } = Tabs;

const Form = ({ lang, setFieldValue, values, setSaveType, isUpdate, isFetched }) => {

    const history = useHistory();
    const {t} = useTranslation();
    const [activeLangKey, setLangKey] = useState("ru")

    function callback(key) {
        setLangKey(key)
    }

    console.log(activeLangKey)
    console.log(values)

    return (
        <GridElements.Row gutter={10} className={"mb-30"}>
            <GridElements.Column xs={8} gutter={10}>
                <Panel>
                    <Tabs defaultActiveKey={activeLangKey} onChange={callback}>
                        <TabPane tab="Контент - ru" key="ru">
                            <Field
                                component={Fields.AntInput}
                                name={`name_ru`}
                                type="text"
                                placeholder={t("Введите загаловок")}
                                label={t("Заголовок")}
                                size="large"
                            />
                            <Field
                                component={Ckeditor}
                                name={`body_ru`}
                                placeholder={t("Полный текст новости")}
                                label={t("Полный текст новости")}
                            />
                        </TabPane>
                        <TabPane tab="Контент - uz" key="uz">
                            <Field
                                component={Fields.AntInput}
                                name={`name_uz`}
                                type="text"
                                placeholder={t("Введите загаловок")}
                                label={t("Заголовок")}
                                size="large"
                            />
                            <Field
                                component={Ckeditor}
                                name={`body_uz`}
                                placeholder={t("Полный текст новости")}
                                label={t("Полный текст новости")}
                            />
                        </TabPane>
                        <TabPane tab="Контент - en" key="en">
                            <Field
                                component={Fields.AntInput}
                                name={`name_en`}
                                type="text"
                                placeholder={t("Введите загаловок")}
                                label={t("Заголовок")}
                                size="large"
                            />
                            <Field
                                component={Ckeditor}
                                name={`body_en`}
                                placeholder={t("Полный текст новости")}
                                label={t("Полный текст новости")}
                            />
                        </TabPane>
                    </Tabs>


                    <Field
                        component={Fields.UploadImageManager}
                        name="documents"
                        isDocument={true}
                        label={t("Файл для загрузки")}
                        size="large"
                        className={"mb-10"}
                        isMulti
                        limit={100}
                        columns={6}
                    />
                </Panel>
            </GridElements.Column>
            <GridElements.Column xs={4} gutter={10}>
                <Panel>
                    {isFetched && (
                        <Field
                            component={Fields.UploadImageManager}
                            name="file"
                            label={t("Главный фото")}
                            size="large"
                            className={"mb-10"}
                        />
                    )}


                    <Field
                        component={Fields.AntInput}
                        name="price"
                        type="text"
                        placeholder={t("Введите цена")}
                        label={t("Цена")}
                        size="large"
                    />

                    <Field
                        component={Fields.AsyncSelect}
                        name="category_id"
                        placeholder={"Виберите категория"}
                        label={"Категория"}
                        isClearable
                        loadOptionsUrl="/categories"
                        className="mb-20"
                        optionLabel={`name_${lang}`}
                        filterParams={{
                            type: 1
                        }}
                    />

                    <ColorContainer>
                        <ChromePicker
                            disableAlpha={true}
                            color={values.color ? values.color : "#000"}
                            onChangeComplete={color => setFieldValue("color", color.hex)}
                            onChange={color => setFieldValue("color", color.hex)}
                        />
                    </ColorContainer>

                    {isFetched && (
                        <Field
                            component={Fields.UploadImageManagerWithColor}
                            name="paletteUpload"
                            label={t("Галерея")}
                            limit={30}
                            size="large"
                            className={"mb-10"}
                        />
                    )}

                    <div className="d-flex align-items-center mb-20">
                        <Switch
                            onChange={value => {
                                setFieldValue('status', value)
                            }}
                            checked={values.status}
                        />
                        <div className="ant-label mb-0 ml-10">{t('Активный статус')}</div>
                    </div>

                    <div className="d-flex align-items-center mb-20">
                        <Switch
                            onChange={value => {
                                setFieldValue('top', value)
                            }}
                            checked={values.top}
                        />
                        <div className="ant-label mb-0 ml-10">{t('Топ')}</div>
                    </div>

                    <div className="buttons-wrap">
                        {isUpdate ? (
                            <Fragment>
                                <Button
                                    type="primary"
                                    size="large"
                                    className="fs-14 fw-300"
                                    htmlType="submit"
                                    onClick={() => setSaveType('list')}
                                >{t("Сохранить")}</Button>

                                <Button
                                    type="ghost"
                                    size="large"
                                    className="fs-14 fw-300"
                                    htmlType="submit"
                                    onClick={() => {
                                        setSaveType('update');
                                    }}
                                >{t("Применить")}</Button>

                                <Button
                                    type="ghost"
                                    size="large"
                                    className="fs-14 fw-300"
                                    htmlType="button"
                                    onClick={() => history.push(`/posts?lang=${lang}`)}
                                >{t("Отменить")}</Button>

                                <Button
                                    type="ghost"
                                    size="large"
                                    className="fs-14 fw-300 btn-with-icon"
                                    htmlType="submit"
                                    onClick={() => setSaveType('create')}
                                ><PlusIcon/> {t("Сохранить и добавить")}</Button>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <Button
                                    type="primary"
                                    size="large"
                                    className="fs-14 fw-300"
                                    htmlType="submit"
                                >{t("Сохранить")}</Button>

                                <Button
                                    type="ghost"
                                    size="large"
                                    className="fs-14 fw-300"
                                    htmlType="button"
                                    onClick={() => history.push(`/posts?lang=${lang}`)}
                                >{t("Отменить")}</Button>
                            </Fragment>
                        )}

                    </div>
                </Panel>
            </GridElements.Column>
        </GridElements.Row>
    );
};

const ColorContainer = styled.div`
  display: table;
  width: 100%;
  margin-bottom: 2rem;
  .chrome-picker {
    width: 100%!important;
  }
`;

export default Form;