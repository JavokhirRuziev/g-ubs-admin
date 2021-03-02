import React, {Fragment} from 'react';

import {Fields, GridElements, Panel, Ckeditor} from "components";
import {Field, ErrorMessage} from "formik";
import {Button, Radio, TreeSelect, Switch, Spin} from "antd";
import EntityContainer from "modules/entity/containers";

import get from "lodash/get";
import {useTranslation} from "react-i18next";
import {ReactComponent as PlusIcon} from "assets/images/icons/plus.svg";
import {useHistory} from "react-router";

const Form = ({
                  isUpdate, lang, setFieldValue, values, isFetched, setSaveType, openHandler = () => {
    }, tagField
              }) => {

    const history = useHistory();
    const {t} = useTranslation();

    return (
        <GridElements.Row gutter={10} className={"mb-30"}>
            <GridElements.Column xs={8} gutter={10}>
                <Panel>
                    <Field
                        component={Fields.AntInput}
                        name="title"
                        type="text"
                        placeholder={t("Введите загаловок")}
                        label={t("Заголовок")}
                        size="large"
                    />
                    <Field
                        component={Fields.AntTextarea}
                        name="description"
                        type="text"
                        rows={5}
                        label={t("Описание")}
                        placeholder={t("Введите описание")}
                    />
                    <Field
                        component={Ckeditor}
                        name="content"
                        placeholder={t("Полный текст новости")}
                        label={t("Полный текст новости")}
                    />

                    <div className="ant-label mb-10">{t('Параметри')}</div>
                    <div className="d-flex mb-24">
                        <Field
                            name="top"
                            component={Fields.AntCheckbox}
                            title={t("В Топе")}
                            className={"mb-0"}
                            checked={Boolean(values.top)}
                        />
                        <Field
                            name="show_photo"
                            component={Fields.AntCheckbox}
                            title={t("Показать фото")}
                            className={"mr-20 ml-20 mb-0"}
                            checked={Boolean(values.show_photo)}
                        />
                    </div>

                </Panel>
            </GridElements.Column>
            <GridElements.Column xs={4} gutter={10}>
                <Panel>
                    {isFetched && (
                        <div className="field-container">
                            <div className="ant-row ant-form-item mb-10">
                                <div className="ant-label">{t('Тип новости')}</div>
                                <Radio.Group className="d-flex flex-wrap" defaultValue={values.type}
                                             onChange={e => setFieldValue("type", e.target.value)}>
                                    <Radio value={4} className="mb-10">{t('Обычный')}</Radio>
                                    <Radio value={1}>{t('Фото')}</Radio>
                                    <Radio value={2}>{t('Видео')}</Radio>
                                    <Radio value={3}>{t('Слидер')}</Radio>
                                </Radio.Group>
                            </div>
                        </div>
                    )}

                    <div className="field-container mb-20">
                        <div className="ant-label">{t('Категория')}</div>
                        <EntityContainer.All
                            entity="category"
                            name="categoryPost"
                            url="/categories"
                            params={{
                                limit: 100,
                                include: ["children"],
                                filter: {type: "post"}
                            }}>
                            {({items, isFetched}) => {
                                const filteredItems =
                                    isFetched &&
                                    items.filter(
                                        item => item.parent_id === null || !item.parent_id
                                    );
                                const treeData =
                                    isFetched &&
                                    filteredItems.reduce((acc, curr) => {
                                        return [
                                            ...acc,
                                            {
                                                ...curr,
                                                title: curr[`name_${lang}`],
                                                key: curr["id"],
                                                value: curr["id"],
                                                children: curr.children ? curr.children.reduce((acc, curr) => {
                                                    return [
                                                        ...acc,
                                                        {
                                                            ...curr,
                                                            title: curr[`name_${lang}`],
                                                            key: curr["id"],
                                                            value: curr["id"]
                                                        }
                                                    ];
                                                }, []) : []
                                            }
                                        ];
                                    }, []);

                                return (
                                    <Fragment>
                                        {!isFetched ? <Spin spinning={true}/> : (
                                            <TreeSelect
                                                allowClear
                                                size="large"
                                                style={{width: "100%"}}
                                                value={get(values, 'category_id') ? values.category_id : null}
                                                dropdownStyle={{
                                                    maxHeight: 400,
                                                    overflow: "auto"
                                                }}
                                                treeData={treeData ? treeData : []}
                                                placeholder={t("Категория")}
                                                multiple
                                                treeDefaultExpandAll
                                                onChange={value => {
                                                    setFieldValue("category_id", value);
                                                }}
                                            />
                                        )}

                                    </Fragment>
                                );
                            }}
                        </EntityContainer.All>
                        <ErrorMessage name="category_id">
                            {message => <div className="custom-error">{message}</div>}
                        </ErrorMessage>
                    </div>

                    <Field
                        component={Fields.AntDatePicker}
                        name="begin_publish_time"
                        showTime={{format: 'HH:mm'}}
                        format="YYYY-MM-DD HH:mm"
                        size="large"
                        label={t("Дата публикации")}
                        placeholder={t("Дата публикации")}
                        style={{width: '100%'}}
                        onChange={(date) => {
                            setFieldValue('begin_publish_time', date)
                        }}
                    />

                    <Field
                        component={Fields.AsyncSelect}
                        name="countries"
                        placeholder={t("Страна")}
                        label={t("Страна")}
                        isClearable={true}
                        isSearchable={true}
                        isMulti={true}
                        loadOptionsUrl="/country"
                        className={"mb-20"}
                        optionLabel={`name_${lang}`}
                        loadOptionsParams={search => {
                            return {
                                extra: {name: search},
                                sort: 'name'
                            }
                        }}
                    />

                    <Field
                        component={Fields.AsyncSelect}
                        name="embassies"
                        placeholder={t("Виберите посольство")}
                        label={t("Посольство")}
                        isClearable
                        isSearchable={true}
                        loadOptionsUrl="/embassy"
                        className="mb-20"
                        optionLabel="name"
                        isMulti
                        loadOptionsParams={search => {
                            return {
                                extra: {
                                    name: search,
                                    _l: lang
                                },
                                sort: 'name'
                            }
                        }}
                    />

                    <div className="d-flex align-items-center mb-20">
                        <Field
                            component={Fields.AsyncSelect}
                            name="tag_id"
                            placeholder={t("Виберите теги")}
                            label={t("Теги")}
                            isClearable
                            isSearchable
                            loadOptionsUrl="/tags"
                            className="mb-0 flex-1"
                            style={{marginBottom: '0px'}}
                            optionLabel="title"
                            canUpdate={tagField}
                            isMulti
                            loadOptionsParams={(search) => {
                                return {
                                    extra: {title: search}
                                }
                            }}
                        />

                        <div className="plus-btn mt-25 ml-10" onClick={() => openHandler()}/>
                    </div>

                    <Field
                        component={Fields.UploadImageManager}
                        name="files"
                        label={t("Фото")}
                        size="large"
                        className={"mb-10"}
                    />

                    <Field
                        component={Fields.UploadImageManager}
                        name="download_files"
                        label={t("Файл для загрузки")}
                        size="large"
                        className={"mb-10"}
                        isMulti
                        limit={8}
                        isDocument
                    />

                    <Field
                        component={Fields.AsyncSelect}
                        name="doc_id"
                        placeholder={t("Виберите документ")}
                        label={t("Документы")}
                        isClearable
                        loadOptionsUrl="/documents"
                        className="mb-24"
                        optionLabel="name"
                        isMulti
                        loadOptionsParams={() => {
                            return {
                                extra: {_l: lang}
                            }
                        }}
                    />

                    <Field
                        component={Fields.AntInput}
                        name="photo_text"
                        type="text"
                        label={t("Текст описания для картинки")}
                        placeholder={t("Введите описания к картинку")}
                        disabled={!Boolean(values.show_photo)}
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

                    <div className="buttons-wrap">
                        {isUpdate ? (
                            <Fragment>
                                <Button
                                    type="primary"
                                    size="large"
                                    className="fs-14 fw-300"
                                    htmlType="submit"
                                    onClick={() => setSaveType('list')}
                                >{t("Сохранить")}</Button>

                                <Button
                                    type="ghost"
                                    size="large"
                                    className="fs-14 fw-300"
                                    htmlType="submit"
                                    onClick={() => {
                                        setSaveType('update');
                                    }}
                                >{t("Применить")}</Button>

                                <Button
                                    type="ghost"
                                    size="large"
                                    className="fs-14 fw-300"
                                    htmlType="button"
                                    onClick={() => history.push(`/posts?lang=${lang}`)}
                                >{t("Отменить")}</Button>

                                <Button
                                    type="ghost"
                                    size="large"
                                    className="fs-14 fw-300 btn-with-icon"
                                    htmlType="submit"
                                    onClick={() => setSaveType('create')}
                                ><PlusIcon/> {t("Сохранить и добавить")}</Button>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <Button
                                    type="primary"
                                    size="large"
                                    className="fs-14 fw-300"
                                    htmlType="submit"
                                >{t("Сохранить")}</Button>

                                <Button
                                    type="ghost"
                                    size="large"
                                    className="fs-14 fw-300"
                                    htmlType="button"
                                    onClick={() => history.push(`/posts?lang=${lang}`)}
                                >{t("Отменить")}</Button>
                            </Fragment>
                        )}

                    </div>
                </Panel>
            </GridElements.Column>
        </GridElements.Row>
    );
};

export default Form;