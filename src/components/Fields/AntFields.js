import React from "react";
import {Form, Input, TimePicker, Select, Radio, TreeSelect, InputNumber} from "antd";

const FormItem = Form.Item;
const {Option} = Select;

const CreateAntField = AntComponent => ({
  field,
  form,
  hasFeedback,
  label,
  selectOptions,
  submitCount,
  type,
  style,
  onChange,
  placeholder,
  containerClass="",
  ...props
}) => {
  const touched = form.touched[field.name];
  const submitted = submitCount > 0;
  const hasError = form.errors[field.name];
  const touchedError = hasError && touched;
  const onInputChange = ({target: {value}}) => form.setFieldValue(field.name, value);
  const onChangeInner = value => form.setFieldValue(field.name, value);
  const onBlur = () => form.setFieldTouched(field.name, true);
  return (
    <div className={`field-container ${containerClass}`}>
      <FormItem
        label={false}
        hasFeedback={(hasFeedback && submitted) || (hasFeedback && touched) ? true : false}
        help={touchedError ? hasError : false}
        validateStatus={touchedError ? "error" : "success"}
        {...{style}}>
        {label && <div className="ant-label">{label}</div>}
        <AntComponent
          {...field}
          {...props}
          {...{type, defaultValue: field.value}}
          placeholder={placeholder}
          onBlur={onBlur}
          onChange={onChange ? onChange : type ? onInputChange : onChangeInner}>
          {selectOptions &&
          selectOptions.map(option => (
            <Option key={option.value} value={option.value}>
              {option.name}
            </Option>
          ))}
        </AntComponent>
      </FormItem>
    </div>
  );
};

export const AntSelect = CreateAntField(Select);
export const AntInput = CreateAntField(Input);
export const AntInputNumber = CreateAntField(InputNumber);
export const AntTextarea = CreateAntField(Input.TextArea);
export const AntRadio = CreateAntField(Radio);
export const AntTreeSelect = CreateAntField(TreeSelect);
export const AntPassword = CreateAntField(Input.Password);
export const AntTimePicker = CreateAntField(TimePicker);
