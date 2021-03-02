import React from 'react';

import {Fields, GridElements, Panel} from "components";
import {Field} from "formik";
import {Button, Switch} from "antd";

import {useTranslation} from "react-i18next";
import {ReactComponent as PlusIcon} from "assets/images/icons/plus.svg";
import {useHistory} from "react-router";

const Form = ({lang, setFieldValue, values, setSaveType}) => {

    const history = useHistory();
    const {t} = useTranslation();

    return (
        <GridElements.Row gutter={10} className={"mb-30"}>
            <GridElements.Column xs={8} gutter={10}>
                <Panel>
                    <Field
                        component={Fields.AntInput}
                        name="question"
                        type="text"
                        placeholder={t("Введите Вопрос")}
                        label={t("Вопрос")}
                        size="large"
                    />
                    <Field
                        component={Fields.AntTextarea}
                        name="answer"
                        type="text"
                        placeholder={t("Введите Ответ")}
                        label={t("Ответ")}
                        size="large"
                        rows={6}
                    />
                </Panel>
            </GridElements.Column>

            <GridElements.Column xs={4} gutter={10}>
                <Panel>
                    <div className="d-flex align-items-center mb-24">
                        <Switch
                            onChange={value => {
                                setFieldValue('status', value)
                            }}
                            checked={values.status}
                        />
                        <div className="ant-label mb-0 ml-10">{t('Активный статус')}</div>
                    </div>

                    <div className="buttons-wrap">
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
                            onClick={() => setSaveType('update')}
                        >{t("Применить")}</Button>

                        <Button
                            type="ghost"
                            size="large"
                            className="fs-14 fw-300"
                            htmlType="button"
                            onClick={() => history.push(`/faq?lang=${lang}`)}
                        >{t("Отменить")}</Button>

                        <Button
                            type="ghost"
                            size="large"
                            className="fs-14 fw-300 btn-with-icon"
                            htmlType="submit"
                            onClick={() => setSaveType('create')}
                        ><PlusIcon/> {t("Сохранить и добавить")}</Button>

                    </div>

                </Panel>
            </GridElements.Column>
        </GridElements.Row>
    );
};

export default Form;