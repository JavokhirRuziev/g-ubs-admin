import React from 'react';

import {Fields} from "components";
import {Field} from "formik";
import {Button, Switch} from "antd";
import {useTranslation} from 'react-i18next'

const Form = ({isUpdate, setFieldValue, values}) => {
    const {t} = useTranslation("main");
    return (
        <div>
            <div className="title-md fs-16 mb-20">{isUpdate ? t('Изменить') : t('Добавить')}</div>
            <Field
                component={Fields.AntInput}
                name="title_ru"
                type="text"
                placeholder={t("Введите название")}
                label={t("Название (RU)")}
                size="large"
            />
            <Field
                component={Fields.AntInput}
                name="title_uz"
                type="text"
                placeholder={t("Введите название")}
                label={t("Название (UZ)")}
                size="large"
            />
            <Field
                component={Fields.AntInput}
                name="title_en"
                type="text"
                placeholder={t("Введите название")}
                label={t("Название (EN)")}
                size="large"
            />
            <Field
                component={Fields.AntInput}
                name="sort"
                type="text"
                placeholder={t("Сортировка")}
                label={t("Сортировка")}
                size="large"
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