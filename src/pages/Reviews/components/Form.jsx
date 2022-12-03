import React from 'react';

import get from "lodash/get";
import {Button, Switch} from "antd";
import {useTranslation} from 'react-i18next'

const Form = ({isUpdate, setFieldValue, values}) => {
    const {t} = useTranslation("main");
    return (
        <div>
            <div className="info-col">
                <div className="info-col__label">Комментария</div>
                <div className="info-col__value">{get(values, 'message', "-")}</div>

            </div>

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