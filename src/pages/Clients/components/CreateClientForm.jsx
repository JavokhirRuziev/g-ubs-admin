import React from "react";

import { Fields, GridElements } from "components";
import { Field } from "formik";
import { Button, DatePicker } from "antd";
import { useTranslation } from "react-i18next";

const Form = ({ isUpdate, values, setFieldValue, submitForm }) => {
    const { t } = useTranslation();
    return (
        <div>
            <div className="title-md fs-16 mb-20">{isUpdate ? t("Изменения клиента") : t("Добавления клиента")}</div>

            <GridElements.Row>
                <GridElements.Column xs={values.type ? 6 : 12}>
                    <Field
                        component={Fields.AntInput}
                        name="name"
                        type="text"
                        placeholder={t("Имя")}
                        size="large"
                    />
                    <Field
                        component={Fields.AntInput}
                        name="surname"
                        type="text"
                        placeholder={t("Фамилия")}
                        size="large"
                    />
                    <Field
                        component={Fields.InputMaskField}
                        name="phone"
                        type="text"
                        mask="+\9\9\899 999-99-99"
                        placeholder={t("Номер телефона")}
                    />
                    {/*<div className="mb-24">*/}
                    {/*    <div className="ant-label mr-6 mb-3">{t("Дата рождения")}</div>*/}
                    {/*    <Field*/}
                    {/*        value={values.birthday}*/}
                    {/*        component={DatePicker}*/}
                    {/*        name="birthday"*/}
                    {/*        size="large"*/}
                    {/*        placeholder={t("Выберите дату")}*/}
                    {/*        onChange={(date) => {*/}
                    {/*            setFieldValue("birthday", date);*/}
                    {/*        }}*/}
                    {/*    />*/}
                    {/*</div>*/}
                </GridElements.Column>
            </GridElements.Row>

            <Button
                type="primary"
                size="large"
                className="fs-14 fw-300"
                htmlType="button"
                onClick={() => {
                    submitForm();
                }}
            >{isUpdate ? t("Сохранить") : t("Добавить")}</Button>
        </div>
    );
};

export default Form;
