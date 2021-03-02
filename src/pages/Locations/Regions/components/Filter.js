import React, {Component} from 'react';

import {Fields, GridElements} from "components";
import {Button, Tooltip} from "antd";

import qs from 'qs';
import { Field, withFormik } from "formik";
import {withRouter} from "react-router";
import {withTranslation} from "react-i18next";

class Filter extends Component {

  render() {
    const { handleSubmit, t, history} = this.props;

    const clearForm = () => {
      history.push({
        search: qs.stringify({}, {encode: false})
      })
    };

    return (
      <div className="filter-row">
        <form onSubmit={handleSubmit}>
          <GridElements.Row gutter={10} wrap>
            <GridElements.Column gutter={10} xs={110} calc>
              <GridElements.Row gutter={10} wrap>
                <GridElements.Column xs={4} gutter={10}>
                  <Field
                    component={Fields.AntInput}
                    name="name"
                    type="text"
                    placeholder={t("Поиск страну")}
                    size="large"
                    style={{marginBottom: 5}}
                  />
                </GridElements.Column>
                <GridElements.Column xs={4} gutter={10}>
                  <Field
                    component={Fields.AsyncSelect}
                    name="country"
                    placeholder={t("Страна")}
                    isClearable={true}
                    isSearchable={true}
                    loadOptionsUrl="/country"
                    style={{marginBottom: 0}}
                    className={"mb-0"}
                    optionLabel="name"
                    loadOptionsParams={search => {
                      return{
                        extra: {name: search}
                      }
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
    const country = params.country ? {id: params.country.split('/')[0], name: params.country.split('/')[1]} : null;

    return ({
      name: params.name || '',
      country: country,
    })

  },
  handleSubmit: (values, { props: { location, history } }) => {

    values = {
      ...values,
      country: values.country ? (values.country.id + '/' + values.country.name) : "",
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
