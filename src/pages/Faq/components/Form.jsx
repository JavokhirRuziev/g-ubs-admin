import React, {useState} from 'react';

import {Fields} from "components";
import {Field} from "formik";
import {Button, Switch, Tabs} from "antd";
import {useTranslation} from 'react-i18next'
import config from "config";

const Form = ({isUpdate, setFieldValue, values}) => {
    const {t} = useTranslation("main");
    const [lang, setLang] = useState("ru");
    const TabPane = Tabs.TabPane;

    return (
        <div>

            <Tabs
                activeKey={lang}
                onChange={value => {
                    setLang(value);
                }}
            >
                {config.API_LANGUAGES.map(item => (
                    <TabPane key={item.code} tab={t(item.title)} />
                ))}
            </Tabs>

            <div className="title-md fs-16 mb-20">{isUpdate ? t('Изменить') : t('Добавить')}</div>


            {lang === 'uz' && (
                <>
                    <Field
                        component={Fields.AntInput}
                        name="title_uz"
                        type="text"
                        placeholder={t("Введите вопрос")}
                        label={t("Вопрос")}
                        size="large"
                    />
                    <Field
                        component={Fields.AntTextarea}
                        name="description_uz"
                        type="text"
                        placeholder={t("Введите ответ")}
                        label={t("Ответ")}
                        size="large"
                        rows={5}
                    />
                </>
            )}

            {lang === 'ru' && (
                <>
                    <Field
                        component={Fields.AntInput}
                        name="title_ru"
                        type="text"
                        placeholder={t("Введите вопрос")}
                        label={t("Вопрос")}
                        size="large"
                    />
                    <Field
                        component={Fields.AntTextarea}
                        name="description_ru"
                        type="text"
                        placeholder={t("Введите ответ")}
                        label={t("Ответ")}
                        size="large"
                        rows={5}
                    />
                </>
            )}

            {lang === 'en' && (
                <>
                    <Field
                        component={Fields.AntInput}
                        name="title_en"
                        type="text"
                        placeholder={t("Введите вопрос")}
                        label={t("Вопрос")}
                        size="large"
                    />
                    <Field
                        component={Fields.AntTextarea}
                        name="description_en"
                        type="text"
                        placeholder={t("Введите ответ")}
                        label={t("Ответ")}
                        size="large"
                        rows={5}
                    />
                </>
            )}

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