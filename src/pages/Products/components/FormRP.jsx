import React from 'react';

import {Fields} from "components";
import {Field} from "formik";
import {Button, Switch} from "antd";

const Form = ({isUpdate, submitForm}) => {
    return (
        <div>
            <div className="title-md fs-16 mb-20">{isUpdate ? "Изменить" : "Добавить"}</div>
            <Field
                component={Fields.AntInput}
                name="code"
                type="text"
                placeholder="Артикул"
                size="large"
            />

            <Field
                component={Fields.AntInput}
                name="size"
                type="text"
                placeholder="Размер"
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

export default Form;