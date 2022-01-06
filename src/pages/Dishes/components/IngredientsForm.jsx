import React from 'react';

import {Fields} from "components";
import {Field} from "formik";
import {Button} from "antd";

const IngredientsForm = ({isUpdate, submitForm}) => {
    return (
        <div>
            <div className="title-md fs-16 mb-20">{isUpdate ? "Изменить" : "Добавить"}</div>

            <Field
                component={Fields.AntInput}
                name="title_ru"
                type="text"
                placeholder="Названия (RU)"
                size="large"
            />
            <Field
                component={Fields.AntInput}
                name="title_uz"
                type="text"
                placeholder="Названия (UZ)"
                size="large"
            />
            <Field
                component={Fields.AntInput}
                name="title_en"
                type="text"
                placeholder="Названия (EN)"
                size="large"
            />
            <Field
                component={Fields.AntInput}
                name="price"
                type="text"
                placeholder="Цена"
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
            >{isUpdate ? "Сохранить" : "Добавить"}</Button>
        </div>
    );
};

export default IngredientsForm;
