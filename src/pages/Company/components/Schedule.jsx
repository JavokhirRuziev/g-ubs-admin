import React from 'react';

import {Fields} from "components";
import {Button, Spin, Switch} from "antd";
import EntityForm from "modules/entity/forms";
import InputMask from "react-input-mask";

import {Field} from "formik";
import {useTranslation} from "react-i18next";
  import get from "lodash/get";

const Schedule = ({user_id, type, schedule, setSchedule}) => {

  const setValue = ({day, key, value, setFieldValue, values}) => {
    let newValue = {
      ...values[day],
      [key]: value
    };
    setFieldValue(day, newValue)
  };

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const {t} = useTranslation();

  const isUpdate = get(schedule, 'id');

  const monday = get(schedule, 'days', []).find(d => d.day === "Monday");
  const tuesday = get(schedule, 'days', []).find(d => d.day === "Tuesday");
  const wednesday = get(schedule, 'days', []).find(d => d.day === "Wednesday");
  const thursday = get(schedule, 'days', []).find(d => d.day === "Thursday");
  const friday = get(schedule, 'days', []).find(d => d.day === "Friday");
  const saturday = get(schedule, 'days', []).find(d => d.day === "Saturday");
  const sunday = get(schedule, 'days', []).find(d => d.day === "Sunday");

  return (
    <div className="default-table pad-10">
      <EntityForm.Main
        method={isUpdate ? 'put' : 'post'}
        entity="schedule"
        name={`schedules`}
        url={isUpdate ? `/hr/work-schedule/${user_id}` : '/hr/work-schedule'}
        updateData={true}
        primaryKey="id"
        params={{
          include:'days'
        }}
        normalizeData={data => data}
        onSuccess={(data, resetForm) => {
          setSchedule(data)
        }}
        fields={[
          {
            name: "user_id",
            value: user_id
          },
          {
            name: "type",
            value: type
          },
          {
            name: "work_time",
            value: get(schedule, 'work_time'),
            required: true,
            type: "number"
          },
          {
            name: "salary",
            value: get(schedule, 'salary') ? get(schedule, 'salary') : "",
            required: true,
            type: "number"
          },
          {
            name: "days",
            onSubmitValue: (value, values) => {
              return [
                values.monday,
                values.tuesday,
                values.wednesday,
                values.thursday,
                values.friday,
                values.saturday,
                values.sunday,
              ]
            }
          },
          {
            name: "monday",
            disabled: true,
            value: {
              day: "Monday",
              active: isUpdate ? !!get(monday, 'start_at') : false,
              start_at: isUpdate ? (get(monday, 'start_at') ? monday.start_at : ' ') : '09:00',
              end_at: isUpdate ? (get(monday, 'end_at') ? monday.end_at : ' ') : '18:00',
              lunch_active: isUpdate ? !!get(monday, 'lunch_start') : true,
              lunch_start: isUpdate ? (get(monday, 'lunch_start') ? monday.lunch_start : ' ') : '12:00',
              lunch_end: isUpdate ? (get(monday, 'lunch_end') ? monday.lunch_end : ' ') : '13:00',
            }
          },
          {
            name: "tuesday",
            disabled: true,
            value: {
              day: "Tuesday",
              active: isUpdate ? !!get(tuesday, 'start_at') : false,
              start_at: isUpdate ? (get(tuesday, 'start_at') ? tuesday.start_at : ' ') : '09:00',
              end_at: isUpdate ? (get(tuesday, 'end_at') ? tuesday.end_at : ' ') : '18:00',
              lunch_active: isUpdate ? !!get(tuesday, 'lunch_start') : true,
              lunch_start: isUpdate ? (get(tuesday, 'lunch_start') ? tuesday.lunch_start : ' ') : '12:00',
              lunch_end: isUpdate ? (get(tuesday, 'lunch_end') ? tuesday.lunch_end : ' ') : '13:00',
            }
          },
          {
            name: "wednesday",
            disabled: true,
            value: {
              day: "Wednesday",
              active: isUpdate ? !!get(wednesday, 'start_at') : false,
              start_at: isUpdate ? (get(wednesday, 'start_at') ? wednesday.start_at : ' ') : '09:00',
              end_at: isUpdate ? (get(wednesday, 'end_at') ? wednesday.end_at : ' ') : '18:00',
              lunch_active: isUpdate ? !!get(wednesday, 'lunch_start') : true,
              lunch_start: isUpdate ? (get(wednesday, 'lunch_start') ? wednesday.lunch_start : ' ') : '12:00',
              lunch_end: isUpdate ? (get(wednesday, 'lunch_end') ? wednesday.lunch_end : ' ') : '13:00',
            }
          },
          {
            name: "thursday",
            disabled: true,
            value: {
              day: "Thursday",
              active: isUpdate ? !!get(thursday, 'start_at') : false,
              start_at: isUpdate ? (get(thursday, 'start_at') ? thursday.start_at : ' ') : '09:00',
              end_at: isUpdate ? (get(thursday, 'end_at') ? thursday.end_at : ' ') : '18:00',
              lunch_active: isUpdate ? !!get(thursday, 'lunch_start') : true,
              lunch_start: isUpdate ? (get(thursday, 'lunch_start') ? thursday.lunch_start : ' ') : '12:00',
              lunch_end: isUpdate ? (get(thursday, 'lunch_end') ? thursday.lunch_end : ' ') : '13:00',
            }
          },
          {
            name: "friday",
            disabled: true,
            value: {
              day: "Friday",
              active: isUpdate ? !!get(friday, 'start_at') : false,
              start_at: isUpdate ? (get(friday, 'start_at') ? friday.start_at : ' ') : '09:00',
              end_at: isUpdate ? (get(friday, 'end_at') ? friday.end_at : ' ') : '18:00',
              lunch_active: isUpdate ? !!get(friday, 'lunch_start') : true,
              lunch_start: isUpdate ? (get(friday, 'lunch_start') ? friday.lunch_start : ' ') : '12:00',
              lunch_end: isUpdate ? (get(friday, 'lunch_end') ? friday.lunch_end : ' ') : '13:00',
            }
          },
          {
            name: "saturday",
            disabled: true,
            value: {
              day: "Saturday",
              active: isUpdate ? !!get(saturday, 'start_at') : false,
              start_at: isUpdate ? (get(saturday, 'start_at') ? saturday.start_at : ' ') : '09:00',
              end_at: isUpdate ? (get(saturday, 'end_at') ? saturday.end_at : ' ') : '18:00',
              lunch_active: isUpdate ? !!get(saturday, 'lunch_start') : true,
              lunch_start: isUpdate ? (get(saturday, 'lunch_start') ? saturday.lunch_start : ' ') : '12:00',
              lunch_end: isUpdate ? (get(saturday, 'lunch_end') ? saturday.lunch_end : ' ') : '13:00',
            }
          },
          {
            name: "sunday",
            disabled: true,
            value: {
              day: "Sunday",
              active: isUpdate ? !!get(sunday, 'start_at') : false,
              start_at: isUpdate ? (get(sunday, 'start_at') ? sunday.start_at : ' ') : '09:00',
              end_at: isUpdate ? (get(sunday, 'end_at') ? sunday.end_at : ' ') : '18:00',
              lunch_active: isUpdate ? !!get(sunday, 'lunch_start') : true,
              lunch_start: isUpdate ? (get(sunday, 'lunch_start') ? sunday.lunch_start : ' ') : '12:00',
              lunch_end: isUpdate ? (get(sunday, 'lunch_end') ? sunday.lunch_end : ' ') : '13:00',
            }
          }
        ]}
      >
        {({isSubmitting, values, setFieldValue}) => {
          return (
            <Spin spinning={isSubmitting}>
              <div className="ant-table">
                <div className="ant-table-body">
                  <table>
                    <thead className="ant-table-thead">
                      <tr>
                        <th className="w-150">
                          <span className="ant-table-header-column">
                            <div>
                              <span className="ant-table-column-title">{t("День")}</span>
                              <span className="ant-table-column-sorter"/>
                            </div>
                          </span>
                        </th>
                        <th className="w-100">
                          <span className="ant-table-header-column">
                            <div>
                              <span className="ant-table-column-title">{t("Статус")}</span>
                              <span className="ant-table-column-sorter"/>
                            </div>
                          </span>
                        </th>
                        <th className="w-100">
                          <span className="ant-table-header-column">
                            <div>
                              <span className="ant-table-column-title">{t("Время начало")}</span>
                              <span className="ant-table-column-sorter"/>
                            </div>
                          </span>
                        </th>
                        <th className="w-100">
                          <span className="ant-table-header-column">
                            <div>
                              <span className="ant-table-column-title">{t("Время окончания")}</span>
                              <span className="ant-table-column-sorter"/>
                            </div>
                          </span>
                        </th>
                        <th className="w-100">
                          <span className="ant-table-header-column">
                            <div>
                              <span className="ant-table-column-title">{t("Обед")}</span>
                              <span className="ant-table-column-sorter"/>
                            </div>
                          </span>
                        </th>
                        <th className="w-200">
                          <span className="ant-table-header-column">
                            <div>
                              <span className="ant-table-column-title">{t("Время начало обеда")}</span>
                              <span className="ant-table-column-sorter"/>
                            </div>
                          </span>
                        </th>
                        <th className="w-200">
                          <span className="ant-table-header-column">
                            <div>
                              <span className="ant-table-column-title">{t("Время окончания обеда")}</span>
                              <span className="ant-table-column-sorter"/>
                            </div>
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="ant-table-tbody">
                      {days.map(day => (
                        <tr className="ant-table-row" key={day}>
                          <td className="w-150">
                            <div className="divider-wrapper">
                              {t(day)}
                            </div>
                          </td>
                          <td className="w-100">
                            <div className="divider-wrapper">
                              <Switch
                                onChange={value => {
                                  setValue({day, key: 'active', value, setFieldValue, values})
                                }}
                                checked={values[day].active}
                              />
                            </div>
                          </td>
                          <td className="w-150">
                            <div className="divider-wrapper">
                              <InputMask
                                className="form-field__input ant-input ant-input-lg"
                                mask={"99:99"}
                                formatChars={{
                                  '9': '[0-9]',
                                  'A': '[A-Z]'
                                }}
                                disabled={!values[day].active}
                                value={values[day].start_at}
                                onChange={e => {
                                  let value = e.target.value;
                                  setValue({day, key: 'start_at', value, setFieldValue, values})
                                }}
                              />
                            </div>
                          </td>
                          <td className="w-150">
                            <div className="divider-wrapper">
                              <InputMask
                                className="form-field__input ant-input ant-input-lg"
                                mask={"99:99"}
                                formatChars={{
                                  '9': '[0-9]',
                                  'A': '[A-Z]'
                                }}
                                disabled={!values[day].active}
                                value={values[day].end_at}
                                onChange={e => {
                                  let value = e.target.value;
                                  setValue({day, key: 'end_at', value, setFieldValue, values})
                                }}
                              />
                            </div>
                          </td>
                          <td className="w-100">
                            <div className="divider-wrapper">
                              <Switch
                                onChange={value => {
                                  setValue({day, key: 'lunch_active', value, setFieldValue, values})
                                }}
                                disabled={!values[day].active}
                                checked={values[day].lunch_active}
                              />
                            </div>
                          </td>
                          <td className="w-200">
                            <div className="divider-wrapper">
                              <InputMask
                                className="form-field__input ant-input ant-input-lg"
                                mask={"99:99"}
                                formatChars={{
                                  '9': '[0-9]',
                                  'A': '[A-Z]'
                                }}
                                disabled={!values[day].lunch_active}
                                value={values[day].lunch_start}
                                onChange={e => {
                                  let value = e.target.value;
                                  setValue({day, key: 'lunch_start', value, setFieldValue, values})
                                }}
                              />
                            </div>
                          </td>
                          <td className="w-200">
                            <div className="divider-wrapper">
                              <InputMask
                                className="form-field__input ant-input ant-input-lg"
                                mask={"99:99"}
                                formatChars={{
                                  '9': '[0-9]',
                                  'A': '[A-Z]'
                                }}
                                disabled={!values[day].lunch_active}
                                value={values[day].lunch_end}
                                onChange={e => {
                                  let value = e.target.value;
                                  setValue({day, key: 'lunch_end', value, setFieldValue, values})
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="row pad-15">
                <Field
                  component={Fields.AntInput}
                  name="work_time"
                  type="number"
                  placeholder={t("Введите время работы")}
                  size="large"
                />
                <Field
                    component={Fields.AntInput}
                    name="salary"
                    type="number"
                    placeholder={t("Введите сумма зарплаты")}
                    size="large"
                    style={{marginLeft: '20px', marginRight: '20px'}}
                />
                <Button
                  type="primary"
                  size="large"
                  className="fs-14 fw-300 w-auto ml-10"
                  block
                  htmlType="submit"
                >{t("Сохранить")}</Button>
              </div>
            </Spin>
          );
        }}
      </EntityForm.Main>
    </div>
  );
};

export default Schedule;
