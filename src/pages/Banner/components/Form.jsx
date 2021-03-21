import React from 'react';

import {Fields} from "components";
import {Field} from "formik";
import {Button, Switch} from "antd";

const Form = ({isUpdate, setFieldValue, values}) => {
    return (
        <div>
            <div className="title-md fs-16 mb-20">{isUpdate ? "Изменить баннер" : "Добавить баннер"}</div>
            <Field
                component={Fields.AntInput}
                name="link"
                type="text"
                placeholder="Введите ссыльку"
                size="large"
            />
            <Field
                component={Fields.AntInput}
                name="sort"
                type="text"
                placeholder="Сортировка"
                size="large"
            />
            <div className="row mb-20">
                <div className="col-md-6">
                    <Field
                        component={Fields.UploadImageManager}
                        name="file"
                        label={"Фото"}
                        size="large"
                    />
                </div>
                <div className="col-md-6">
                    <div className="ant-label">{"Активный статус"}</div>
                    <Switch
                        onChange={value => {
                            setFieldValue('status', value)
                        }}
                        checked={values.status}
                    />
                </div>
            </div>

            <Button
                type="primary"
                size="large"
                className="fs-14 fw-300"
                htmlType="submit"
            >{isUpdate ? "Сохранить" : "Добавить"}</Button>
        </div>
    );
};

export default Form;