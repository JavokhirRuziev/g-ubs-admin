import React from 'react';

import {Fields} from "components";
import {Field} from "formik";
import {Button} from "antd";
import {useTranslation} from "react-i18next";

const IngredientsForm = ({isUpdate, submitForm}) => {
    const {t} = useTranslation("main")
    return (
        <div>
            <div className="title-md fs-16 mb-20">{isUpdate ? "Изменить" : "Добавить"}</div>

            <Field
                component={Fields.AntInput}
                name="title_ru"
                type="text"
                placeholder={t("Название (RU)")}
                size="large"
            />
            <Field
                component={Fields.AntInput}
                name="title_uz"
                type="text"
                placeholder={t("Название (UZ)")}
                size="large"
            />
            <Field
                component={Fields.AntInput}
                name="title_en"
                type="text"
                placeholder={t("Название (EN)")}
                size="large"
            />
            <Field
                component={Fields.AntInput}
                name="price"
                type="text"
                placeholder={t("Цена")}
                size="large"
            />

            <Button
                type="primary"
                size="large"
                className="fs-14 fw-300"
                htmlType="button"
                onClick={() => {
                    submitForm()
                }}
            >{isUpdate ? t("Сохранить") : t("Добавить")}</Button>
        </div>
    );
};

export default IngredientsForm;
