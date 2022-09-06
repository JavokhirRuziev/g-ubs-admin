import React from 'react';

import {Fields} from "components";
import {Field} from "formik";
import {Button} from "antd";
import {useTranslation} from "react-i18next";

const Form = ({isUpdate}) => {
    const {t} = useTranslation();
    return (
        <div>
            <div
                className="title-md fs-16 mb-20">{isUpdate ? t("Изменение категория расходов") : t("Добавление категория расходов")}</div>
            <Field
                component={Fields.AntInput}
                name="title"
                type="text"
                placeholder={t("Введите название")}
                size="large"
            />

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
