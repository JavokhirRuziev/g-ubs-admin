import React from "react";

import { Fields, GridElements } from "components";
import { Field } from "formik";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import config from "../../../config";

const Form = ({ isUpdate, type }) => {
    const { t } = useTranslation();

    const getAddBtnText = () => {
        switch (type){
            case config.CUSTOMER_TYPE_CLIENT:
                return 'Добавить клиент';
            case config.CUSTOMER_TYPE_EMPLOYEE:
                return 'Добавить сотрудник';
            case config.CUSTOMER_TYPE_COUNTER_AGENT:
                return 'Добавить контрагент';
            default:
                return ""
        }
    }
    const getUpdateBtnText = () => {
        switch (type){
            case config.CUSTOMER_TYPE_CLIENT:
                return 'Изменить клиента';
            case config.CUSTOMER_TYPE_EMPLOYEE:
                return 'Изменить сотрудника';
            case config.CUSTOMER_TYPE_COUNTER_AGENT:
                return 'Изменить контрагента';
            default:
                return ""
        }
    }

    return (
        <div>
            <div className="title-md fs-16 mb-20">{isUpdate ? getUpdateBtnText() : getAddBtnText()}</div>

            <GridElements.Row>
                <GridElements.Column xs={12}>
                    <Field
                        component={Fields.AntInput}
                        name="name"
                        type="text"
                        placeholder={t("Имя")}
                        size="large"
                    />
                    <Field
                        component={Fields.InputMaskField}
                        name="phone"
                        type="text"
                        mask="+\9\9\899 999-99-99"
                        placeholder={t("Номер телефона")}
                    />
                </GridElements.Column>
            </GridElements.Row>

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
