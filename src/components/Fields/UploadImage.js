import React from "react";
import axios from "axios";
import { Upload } from "antd";
import { storage } from "services";
import get from "lodash/get";

const UploadImage = (props) => {
  const token = storage.get("token");
  const { setProgress } = props;

  const config = {
    onUploadProgress: function(progressEvent) {
      const { loaded, total } = progressEvent;
      let percent = Math.floor((loaded * 100) / total);
      setProgress(percent);
    },
    headers: {
      Authorization: `Bearer ${token}`

    }

  };

  const {acceptAll} = props;

  const customRequest = options => {
    const data = new FormData();
    data.append("files", options.file);

    axios
      .post(options.action, data, config)
      .then(res => {
        options.onSuccess(res.data, options.file);
      })
      .catch(err => { });
  };

  const onPreview = file => {
    let url = "";
    if (file.url) {
      url = file.preview
    } else {
      const keys = Object.keys(get(file, "response", {}));
      url = get(file, ["response", keys[0], "link"]);
    }
    return window.open(url);
  };

  return (
    <Upload
      accept={acceptAll ? '' : 'image/png,image/jpeg,image/jpeg,image/bmp,image/svg'}
      {...props}
      {...{
        customRequest,
        onPreview
      }}
    />
  );
}

export default UploadImage;
