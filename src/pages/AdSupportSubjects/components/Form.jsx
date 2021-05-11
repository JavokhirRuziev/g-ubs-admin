import React from 'react';

import {Fields} from "components";
import {Field} from "formik";
import {Button, Switch} from "antd";
import {useTranslation} from "react-i18next";

const Form = ({isUpdate, setFieldValue, values}) => {
    const {t} = useTranslation();
    return (
        <div>
            <div className="title-md fs-16 mb-20">{isUpdate ? "Изменить" : "Добавить"}</div>
            <Field
                component={Fields.AntInput}
                name="title"
                type="text"
                placeholder="Введите название"
                size="large"
            />
            <Field
                component={Fields.AntTextarea}
                name="description"
                type="text"
                placeholder="Введите описание"
                size="large"
                rows={5}
            />
            <div className="row">
                <div className="col-6">
                    <Field
                        component={Fields.AntInput}
                        name="sort"
                        type="text"
                        placeholder="Сортировка"
                        size="large"
                    />
                </div>
                <div className="col-6">
                    <Field
                        component={Fields.AntSelect}
                        name="type"
                        optionLabel="label"
                        optionValue="value"
                        placeholder={t("типь")}
                        size={'large'}
                        allowClear
                        selectOptions={[
                            {name: t("Карточка"), value: 1},
                            {name: t("Сетка-2"), value: 2},
                            {name: t("Сетка-4"), value: 4},
                            {name: t("Сетка-5"), value: 5},
                            {name: t("Простой"), value: 3}
                        ]}
                    />
                </div>
            </div>

            <Field
                component={Fields.UploadImageManager}
                name="files"
                label={"Фото"}
                size="large"
                isMulti={true}
                limit={20}
            />

            <div className="mb-10 mt-10">
                <Field
                    component={Fields.UploadImageManager}
                    name="sources"
                    label={"Файлы"}
                    size="large"
                    isMulti={true}
                    limit={10}
                    isDocument={true}
                />
            </div>

            <div className="mb-20">
                <div className="ant-label">{"Активный статус"}</div>
                <Switch
                    onChange={value => {
                        setFieldValue('status', value)
                    }}
                    checked={values.status}
                />
            </div>

            <div className="mb-20">
                <div className="ant-label">{"Показать ссылька скачать"}</div>
                <Switch
                    onChange={value => {
                        setFieldValue('can_download', value)
                    }}
                    checked={values.can_download}
                />
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