import React, {useState} from 'react';

import {useTranslation} from "react-i18next";
import PropTypes from "prop-types";
import cx from "classnames";
import {useDispatch} from "react-redux"

import {Spinner} from "components";
import filemanagerActions from "store/actions/filemanager";
import Dropzone from 'react-dropzone'
import DropzonePlaceholderIcon from "./icons/gallery.svg";
import "./style.scss";

const DropzoneComponent = ({className, title, description, onSuccess, initialValue}) => {

  const [isFetched, setFetched] = useState(true);
  const [error, setError] = useState(false);
  const [items, setItems] = useState(initialValue ? [initialValue] : null);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const classNames = cx(
    'bb-dropzone',
    !isFetched ? "loading" : '',
    error ? 'has-error' : '',
    className,
  );

  const onChange = files => {
    setFetched(false);
    setError(false);

    let formData = new FormData();
    files.forEach(file => formData.append("files[]", file));

    const cb = {
      success: (uploadedImages = {}) => {
        onSuccess(uploadedImages);
        const array = files.reduce((prev, curr) => [...prev, URL.createObjectURL(curr)], []);
        setItems(array);
      },
      failure: (e) => {
        setError(true)
      },
      finally: () => {
        setFetched(true);
      }
    };

    dispatch(filemanagerActions.UploadFile({files: formData, cb}))
  };

  return (
    <Dropzone accept="image/*" onDrop={onChange} multiple={false}>
      {({getRootProps, getInputProps}) => (
        <div {...getRootProps()} className={classNames}>
          {items && (
            <div className="has-image">
              <img src={items[0]} alt="" className="bb-dropzone-file"/>
            </div>
          )}
          <input {...getInputProps()} />
          {!items && (
            <div className="bb-dropzone-content">
              <img src={DropzonePlaceholderIcon} alt="" className="bb-dropzone-icon"/>
              <div className="bb-dropzone-title">{t(title)}</div>
              <div className="bb-dropzone-description">{t(description)}</div>
              {error && (
                <div className="error-message">{t("Возникла ошибка при загрузке")}</div>
              )}
            </div>
          )}
          {!isFetched && (
            <Spinner position={"absolute"} md/>
          )}
        </div>
      )}
    </Dropzone>
  );
};

DropzoneComponent.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  onSuccess: PropTypes.func,
};
DropzoneComponent.defaultProps = {
  className: '',
  title: 'Загрузить фотографию',
  description: 'Такие файлы как jpg, png, gif',
  onSuccess: () => {}
};

export default DropzoneComponent;

