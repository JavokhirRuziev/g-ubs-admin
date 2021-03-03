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
    const { handleSubmit, t, history } = this.props;
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
              <GridElements.Row gutter={10}>
                <GridElements.Column xs={6} gutter={10}>
                  <Field
                    component={Fields.AntInput}
                    name="title"
                    type="text"
                    placeholder={t("Поиск по загаловок")}
                    size="large"
                    style={{marginBottom: 0}}
                    className={"mb-0"}
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
    const category = params.category ? {id: params.category.split('/')[0], name: params.category.split('/')[1]} : null;

    return ({
      title: params.title || '',
      category: category,
      type: params.type ? Number(params.type) : undefined,
      begin_publish_time: params.begin_publish_time ? moment.unix(params.begin_publish_time) : '',
    })

  },
  handleSubmit: (values, { props: { location, history } }) => {

    values = {
      ...values,
      begin_publish_time: values.begin_publish_time ? moment(values.begin_publish_time).unix() : "",
      category: values.category ? (values.category.id + '/' + values.category.name) : "",
    };

    const query = qs.parse(location.search);

    values = Object.keys({ ...query, ...values }).reduce(
      (prev, curr) => values[curr] ? ({ ...prev, [curr]: values[curr] }) : ({ ...prev }), {}
    );


    history.push({
      search: qs.stringify(values, {encode: false})
    })
  },
})(Filter);

export default withRouter(withTranslation("main")(Filter));