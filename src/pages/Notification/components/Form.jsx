import React, {useState} from 'react';

import {Fields} from "components";
import {Field} from "formik";
import {Button, Switch, Tabs, Select} from "antd";
import {useTranslation} from 'react-i18next'
import config from "config";

const Form = ({isUpdate, setFieldValue, values}) => {
    const {t} = useTranslation("");
    const [lang, setLang] = useState("ru");
    const TabPane = Tabs.TabPane;
    const { Option } = Select;

    return (
        <div>
            <div className="title-md fs-16 mb-20">{isUpdate ? t('Изменить') : t('Добавить')}</div>

            <Tabs
                activeKey={lang}
                onChange={value => {
                    setLang(value);
                }}
                className={"mb-24"}
            >
                {config.API_LANGUAGES.map(item => (
                    <TabPane key={item.code} tab={t(item.title)} />
                ))}
            </Tabs>

            <div className="mb-24">
                <div className="ant-label">Тип</div>
                <Select defaultValue={1} size={"large"} onChange={value => setFieldValue("type", value)}>
                    <Option value={3}>Обновление приложения</Option>
                    <Option value={2}>Скидки</Option>
                    <Option value={1}>Информация</Option>
                </Select>
            </div>

            {lang === 'uz' && (
                <>
                    <Field
                        component={Fields.AntInput}
                        name="message_uz"
                        type="text"
                        placeholder={t("Введите сообщение")}
                        label={t("Сообщение")}
                        size="large"
                    />
                    <Field
                        component={Fields.AntTextarea}
                        name="content_uz"
                        type="text"
                        placeholder={t("Введите контент")}
                        label={t("Контент")}
                        size="large"
                        rows={15}
                    />
                </>
            )}

            {lang === 'ru' && (
                <>
                    <Field
                        component={Fields.AntInput}
                        name="message_ru"
                        type="text"
                        placeholder={t("Введите сообщение")}
                        label={t("Сообщение")}
                        size="large"
                    />
                    <Field
                        component={Fields.AntTextarea}
                        name="content_ru"
                        type="text"
                        placeholder={t("Введите контент")}
                        label={t("Контент")}
                        size="large"
                        rows={15}
                    />
                </>
            )}

            {lang === 'en' && (
                <>
                    <Field
                        component={Fields.AntInput}
                        name="message_en"
                        type="text"
                        placeholder={t("Введите сообщение")}
                        label={t("Сообщение")}
                        size="large"
                    />
                    <Field
                        component={Fields.AntTextarea}
                        name="content_en"
                        type="text"
                        placeholder={t("Введите контент")}
                        label={t("Контент")}
                        size="large"
                        rows={15}
                    />
                </>
            )}

            <Field
                component={Fields.AntInput}
                name="link"
                type="text"
                placeholder="Введите ссылку"
                label="Ссылка"
                size="large"
            />

            <div className="d-flex align-items-center mb-20">
                <Switch
                    onChange={value => {
                        setFieldValue('status', value)
                    }}
                    checked={values.status}
                />
                <div className="ant-label mb-0 ml-10">{t('Опубликовать')}</div>
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