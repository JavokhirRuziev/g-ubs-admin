import React, {Component} from 'react';

import {Fields, GridElements} from "components";
import {Button, Tooltip} from "antd";

import qs from 'qs';
import { Field, withFormik } from "formik";
import moment from "moment";
import {withRouter} from "react-router";
import {withTranslation} from "react-i18next";

class Filter extends Component {

  render() {
    const { handleSubmit, setFieldValue, t, history } = this.props;
    const clearForm = () => {
      history.push({
        search: qs.stringify({}, {encode: false})
      })
    };

    return (
      <div className="filter-row pt-20 pl-15 pr-15">
        <form onSubmit={handleSubmit}>
          <GridElements.Row gutter={10} wrap>
            <GridElements.Column gutter={10} xs={110} calc>
              <GridElements.Row className="mb-10" gutter={10}>
                <GridElements.Column xs={3} gutter={10}>
                  <Field
                      component={Fields.AntInput}
                      name="table_number"
                      type="number"
                      placeholder="Номер стола"
                      size="large"
                      className={"mb-0"}
                      style={{marginBottom: '0'}}
                  />
                </GridElements.Column>
                <GridElements.Column xs={3} gutter={10}>
                  <Field
                    component={Fields.AntDatePicker}
                    name="start_at"
                    size="large"
                    placeholder={t("Дата начало")}
                    style={{width: '100%', marginBottom: 0}}
                    className={"mb-0"}
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    onChange={(date) => {
                      setFieldValue('start_at', date)
                    }}
                  />
                </GridElements.Column>
                <GridElements.Column xs={3} gutter={10}>
                  <Field
                      component={Fields.AntDatePicker}
                      name="end_at"
                      size="large"
                      placeholder={t("Дата окончание")}
                      style={{width: '100%', marginBottom: 0}}
                      className={"mb-0"}
                      showTime={{ format: 'HH:mm' }}
                      format="YYYY-MM-DD HH:mm"
                      onChange={(date) => {
                        setFieldValue('end_at', date)
                      }}
                  />
                </GridElements.Column>
              </GridElements.Row>
            </GridElements.Column>
            <GridElements.Column xs={110} gutter={10} customSize>
              <Tooltip title={t("Фильтровать")}>
                <Button
                  type={"primary"}
                  icon="search"
                  htmlType="submit"
                  className={"mr-10"}
                  size={"large"}
                />
              </Tooltip>
              <Tooltip title={t("Очитстить фильтр")}>
                <Button
                  type={"danger"}
                  icon="close"
                  size={"large"}
                  htmlType="button"
                  onClick={clearForm}
                />
              </Tooltip>
            </GridElements.Column>
          </GridElements.Row>
        </form>
      </div>
    );
  }
}

Filter = withFormik({
  enableReinitialize: true,
  mapPropsToValues: ({ location }) => {
    const params = qs.parse(location.search, {ignoreQueryPrefix: true});

    return ({
      table_number: params.table_number ? params.table_number : '',
      start_at: params.start_at ? moment.unix(params.start_at) : '',
      end_at: params.end_at ? moment.unix(params.end_at) : '',
    })

  },
  handleSubmit: (values, { props: { lang, location, history } }) => {

    values = {
      ...values,
      start_at: values.start_at ? moment(values.start_at).unix() : "",
      end_at: values.end_at ? moment(values.end_at).unix() : "",
    };

    const query = qs.parse(location.search);

    values = Object.keys({ ...query, ...values }).reduce(
      (prev, curr) => (values[curr] || values[curr] === 0) ? ({ ...prev, [curr]: values[curr] }) : ({ ...prev }), {}
    );


    history.push({
      search: qs.stringify(values, {encode: false})
    })
  },
})(Filter);

export default withRouter(withTranslation("main")(Filter));