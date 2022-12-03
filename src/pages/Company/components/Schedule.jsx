import React from 'react';

import {Button, Spin, Switch} from "antd";
import EntityForm from "modules/entity/forms";
import InputMask from "react-input-mask";

import {useTranslation} from "react-i18next";
  import get from "lodash/get";

const Schedule = ({schedule}) => {

  const setValue = ({day, key, value, setFieldValue, values}) => {
    let newValue = {
      ...values[day],
      [key]: value
    };
    setFieldValue(day, newValue)
  };

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const {t} = useTranslation("main");

  const isUpdate = schedule.length > 0

  const monday = schedule.find(d => d.day === "Monday");
  const tuesday = schedule.find(d => d.day === "Tuesday");
  const wednesday = schedule.find(d => d.day === "Wednesday");
  const thursday = schedule.find(d => d.day === "Thursday");
  const friday = schedule.find(d => d.day === "Friday");
  const saturday = schedule.find(d => d.day === "Saturday");
  const sunday = schedule.find(d => d.day === "Sunday");

  return (
    <div className="default-table pad-10">
      <EntityForm.Main
        method={'post'}
        entity="schedule"
        name={`schedules`}
        url={'/companies/working-times'}
        updateData={true}
        primaryKey="id"
        normalizeData={data => data}
        onSuccess={(data, resetForm) => {}}
        fields={[
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
              status: isUpdate ? get(monday, 'status') : true,
              start_at: isUpdate ? (get(monday, 'start_at') ? monday.start_at : ' ') : '08:00',
              end_at: isUpdate ? (get(monday, 'end_at') ? monday.end_at : ' ') : '22:00'
            }
          },
          {
            name: "tuesday",
            disabled: true,
            value: {
              day: "Tuesday",
              status: isUpdate ? get(tuesday, 'status') : true,
              start_at: isUpdate ? (get(tuesday, 'start_at') ? tuesday.start_at : ' ') : '08:00',
              end_at: isUpdate ? (get(tuesday, 'end_at') ? tuesday.end_at : ' ') : '22:00'
            }
          },
          {
            name: "wednesday",
            disabled: true,
            value: {
              day: "Wednesday",
              status: isUpdate ? get(wednesday, 'status') : true,
              start_at: isUpdate ? (get(wednesday, 'start_at') ? wednesday.start_at : ' ') : '08:00',
              end_at: isUpdate ? (get(wednesday, 'end_at') ? wednesday.end_at : ' ') : '22:00'
            }
          },
          {
            name: "thursday",
            disabled: true,
            value: {
              day: "Thursday",
              status: isUpdate ? get(thursday, 'status') : true,
              start_at: isUpdate ? (get(thursday, 'start_at') ? thursday.start_at : ' ') : '08:00',
              end_at: isUpdate ? (get(thursday, 'end_at') ? thursday.end_at : ' ') : '22:00'
            }
          },
          {
            name: "friday",
            disabled: true,
            value: {
              day: "Friday",
              status: isUpdate ? get(friday, 'status') : true,
              start_at: isUpdate ? (get(friday, 'start_at') ? friday.start_at : ' ') : '08:00',
              end_at: isUpdate ? (get(friday, 'end_at') ? friday.end_at : ' ') : '22:00'
            }
          },
          {
            name: "saturday",
            disabled: true,
            value: {
              day: "Saturday",
              status: isUpdate ? get(saturday, 'status') : true,
              start_at: isUpdate ? (get(saturday, 'start_at') ? saturday.start_at : ' ') : '08:00',
              end_at: isUpdate ? (get(saturday, 'end_at') ? saturday.end_at : ' ') : '22:00'
            }
          },
          {
            name: "sunday",
            disabled: true,
            value: {
              day: "Sunday",
              status: isUpdate ? get(sunday, 'status') : true,
              start_at: isUpdate ? (get(sunday, 'start_at') ? sunday.start_at : ' ') : '08:00',
              end_at: isUpdate ? (get(sunday, 'end_at') ? sunday.end_at : ' ') : '22:00'
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
                                  setValue({day, key: 'status', value, setFieldValue, values})
                                }}
                                checked={values[day].status}
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
                                disabled={!values[day].status}
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
                                disabled={!values[day].status}
                                value={values[day].end_at}
                                onChange={e => {
                                  let value = e.target.value;
                                  setValue({day, key: 'end_at', value, setFieldValue, values})
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
              <div className="pad-15 d-flex justify-content-start">
                <Button
                    type="primary"
                    size="large"
                    className="fs-14 fw-300"
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
