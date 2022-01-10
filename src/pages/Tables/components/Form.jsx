import React from 'react';

import {Fields} from "components";
import {Field} from "formik";
import {Button, Switch} from "antd";
import {useTranslation} from 'react-i18next'
import get from "lodash/get";

const Form = ({isUpdate, setFieldValue, values}) => {
    const {t} = useTranslation();
    return (
        <div>
            <div className="title-md fs-16 mb-20">{isUpdate ? t('Изменить') : t('Добавить')}</div>
            <Field
                component={Fields.AntInput}
                name="number"
                type="text"
                placeholder={t("Введите номер")}
                label={t("Номер")}
                size="large"
            />
            <Field
                component={Fields.AntInput}
                name="capacity"
                type="text"
                placeholder={t("Введите емкость")}
                label={t("Емкость")}
                size="large"
            />
            <Field
                component={Fields.AsyncSelect}
                name="place_id"
                placeholder={t("Место")}
                isClearable={true}
                loadOptionsUrl="/places"
                label={t("Место")}
                className={"mb-24"}
                optionLabel={option => get(option, 'title_ru')}
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