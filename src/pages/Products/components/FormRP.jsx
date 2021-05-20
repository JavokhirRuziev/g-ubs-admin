import React from 'react';

import {Fields} from "components";
import {Field} from "formik";
import {Button} from "antd";

const Form = ({isUpdate, submitForm}) => {
    return (
        <div>
            <div className="title-md fs-16 mb-20">{isUpdate ? "Изменить" : "Добавить"}</div>

            <div className="row">
                <div className="col-6">
                    <Field
                        component={Fields.AntInput}
                        name="code"
                        type="text"
                        placeholder="Артикул"
                        size="large"
                    />
                </div>
                <div className="col-6">
                    <Field
                        component={Fields.AntInput}
                        name="ten"
                        type="text"
                        placeholder="Тен №"
                        size="large"
                    />
                </div>
                <div className="col-6">
                    <Field
                        component={Fields.AntInput}
                        name="amount"
                        type="text"
                        placeholder="Упаковка/количество"
                        size="large"
                    />
                </div>
                <div className="col-6">
                    <Field
                        component={Fields.AntInput}
                        name="amount_box"
                        type="text"
                        placeholder="Штук в коробке"
                        size="large"
                    />
                </div>
                <div className="col-6">
                    <Field
                        component={Fields.AntInput}
                        name="price"
                        type="text"
                        placeholder="Цена"
                        size="large"
                    />
                </div>
                <div className="col-6">
                    <Field
                        component={Fields.AntInput}
                        name="price_box"
                        type="text"
                        placeholder="Цена коробки"
                        size="large"
                    />
                </div>
                <div className="col-6">
                    <Field
                        component={Fields.AntInput}
                        name="size"
                        type="text"
                        placeholder="Размер"
                        size="large"
                    />
                </div>
                <div className="col-6">
                    <Field
                        component={Fields.AntInput}
                        name="thickness"
                        type="text"
                        placeholder="Толщина мм."
                        size="large"
                    />
                </div>
                <div className="col-6">
                    <Field
                        component={Fields.AntInput}
                        name="width"
                        type="text"
                        placeholder="Ширина"
                        size="large"
                    />
                </div>
                <div className="col-6">
                    <Field
                        component={Fields.AntInput}
                        name="length"
                        type="text"
                        placeholder="Длина"
                        size="large"
                    />
                </div>
            </div>

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
