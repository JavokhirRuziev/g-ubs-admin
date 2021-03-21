import React, {Fragment} from 'react';

import {Fields, GridElements, Panel, Ckeditor} from "components";
import {Field} from "formik";
import {Button, Switch} from "antd";

import {useTranslation} from "react-i18next";
import {ReactComponent as PlusIcon} from "assets/images/icons/plus.svg";
import {useHistory} from "react-router";

const Form = ({ lang, setFieldValue, values, setSaveType, isUpdate }) => {

    const history = useHistory();
    const {t} = useTranslation();

    return (
        <GridElements.Row gutter={10} className={"mb-30"}>
            <GridElements.Column xs={8} gutter={10}>
                <Panel>
                    <Field
                        component={Fields.AntInput}
                        name="title"
                        type="text"
                        placeholder={t("Введите загаловок")}
                        label={t("Заголовок")}
                        size="large"
                    />
                    <Field
                        component={Ckeditor}
                        name="content"
                        placeholder={t("Полный текст новости")}
                        label={t("Полный текст новости")}
                    />
                </Panel>
            </GridElements.Column>
            <GridElements.Column xs={4} gutter={10}>
                <Panel>
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
                            type: 3
                        }}
                    />

                    <Field
                        component={Fields.AntDatePicker}
                        name="publish_time"
                        size="large"
                        label={t("Дата публикации")}
                        placeholder={t("Дата публикации")}
                        style={{width: '100%'}}
                        format={"DD.MM.YYYY / HH:mm"}
                        showTime={true}
                        onChange={(date) => {
                            setFieldValue('publish_time', date)
                        }}
                    />

                    <Field
                        component={Fields.UploadImageManager}
                        name="file"
                        label={t("Фото")}
                        size="large"
                        className={"mb-10"}
                    />

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

export default Form;