import React from 'react';

import {Fields} from "components";
import {Field} from "formik";
import {Button, Switch} from "antd";
import {useTranslation} from "react-i18next";

const Form = ({isUpdate, setFieldValue, values}) => {
    const {t} = useTranslation("main");
    return (
        <div>
            <div
                className="title-md fs-16 mb-20">{isUpdate ? t('Изменение официанта') : t('Добавление официанта')}</div>

            <div className="fake-inputs">
                <input type="text" name={"login"} placeholder={t("Введите логин")}/>
                <input type="password" name={"password"}/>
            </div>

            <Field
                component={Fields.AntInput}
                name="name"
                type="text"
                placeholder={t("Введите имя")}
                label={t("Имя")}
                size="large"
            />
            <Field
                component={Fields.AntInput}
                name="login"
                type="text"
                placeholder={t("Введите логин")}
                label={t("Логин")}
                size="large"
            />
            <Field
                component={Fields.AntInput}
                name="password"
                type="password"
                placeholder={t("Введите пароль")}
                label={t("Пароль")}
                size="large"
            />

            <div className="d-flex align-items-center mb-20 mt-20">
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
            >{isUpdate ? t("Сохранить") : t("Добавить")}</Button>
        </div>
    );
};

export default Form;