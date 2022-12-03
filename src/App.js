import React, {Component} from 'react';

import {helpers, storage} from "services";
import config from "config";
import systemActions from "store/actions/system";
import authActions from "store/actions/auth";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import i18next from 'i18next';
import {withRouter} from "react-router";
import moment from "moment-timezone";

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      error: null
    }
  }

  componentDidMount() {
    moment.tz.setDefault("Asia/Tashkent");
    const {ChangeLanguage, GetMeRequest} = this.props;

    GetMeRequest();

    if (helpers.isEnableLang(storage.get('language'))) {
      ChangeLanguage(storage.get('language'));
      i18next.changeLanguage(storage.get('language'));
    } else {
      ChangeLanguage(config.DEFAULT_LANGUAGE);
      i18next.changeLanguage(config.DEFAULT_LANGUAGE);
    }
  }

  render() {

    const { children, auth } = this.props;
    const { error } = this.state;
    if (error) {
      return (
        <div className="error-page error-page__sentry">
          <div className="error-ico"/>
          <div className="error-text">Something went wrong !!!</div>
          <span className="error-btn mx-btn btn-solid info">Report feedback</span>
        </div>
      );
    }

    return children(auth);
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    ChangeLanguage: systemActions.ChangeLanguage,
    GetMeRequest: authActions.GetMe
  },
  dispatch
);
// deploy commit

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));