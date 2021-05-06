import React, {useState} from 'react';

import {FileManager, GridElements} from "components";
import get from "lodash/get";
import uniqBy from "lodash/uniqBy";

import {ReactComponent as DeleteIcon} from "./icons/delete.svg";
import cx from "classnames";
import {helpers} from "services";

const UploadImageManager = ({useFileName=0,columns=12, isMulti, isDocument = false, limit = 1, label, field, form: {touched, errors, setFieldValue, values}, className}) => {
  const [visible, setVisible] = useState(false);

  const removeHandler = selected => {
    setFieldValue(field.name, values[field.name].filter(item => item.id !== selected.id))
  };

  const classNames = cx("upload-photos", touched[field.name] && errors[field.name] && "has-error", className);
  return (
    <>
      <FileManager
        addImage={(data) => {
          if (isMulti) {
            setFieldValue(field.name, uniqBy([...values[field.name], ...data], 'id'))
          } else {
            setFieldValue(field.name, [data])
          }
        }}
        onCancel={() => {
          setVisible(false)
        }}
        useFileName={useFileName}
        isMulti={isMulti}
        visible={visible}
        isDocument={isDocument}
      />
      <div className={classNames}>
        {label && <div className="ant-label">{label}</div>}
        <div className="preview-list">
          {isDocument ? (
            <div className="w-100p">
              <GridElements.Row gutter={5} wrap>
                {values[field.name].map((item, i) => (
                  <GridElements.Column xs={columns} gutter={5}>

                    <div className="doc-file pad-0 mb-10" key={i}>
                      <div className="doc-file__item">
                        <div className="delete-btn" onClick={() => removeHandler(item)}>
                          <DeleteIcon height={22} width={22}/>
                        </div>
                        <div className="doc-file__ext">{get(item, 'ext')}</div>
                        <div className="doc-file__content">
                          <div className="doc-file__title">{get(item, 'title')}</div>
                          <div className="d-flex fs-12">
                            <div className="w-50p pr-10 d-flex">
                              <div className="">{helpers.formatBytes(get(item, 'size'))}</div>
                            </div>
                            <div className="w-50p pl-10 d-flex">
                              <div className="">{helpers.formatDate(get(item, 'created_at'))}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </GridElements.Column>
                ))}
              </GridElements.Row>
            </div>
          ) : (
            <>
              {values[field.name].map((item, i) => (
                <div className="preview-item" key={get(item, 'id', `${i}`)}>
                  <div className="delete-btn" onClick={() => removeHandler(item)}>
                    <DeleteIcon height={22} width={22}/>
                  </div>
                  <img src={get(item, 'thumbnails.small.src')} alt=""/>
                </div>
              ))}
            </>
          )}


          {limit > values[field.name].length && (
            <div
              className="add-image-btn"
              onClick={() => setVisible(true)}
            >
              Загрузите
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default UploadImageManager;
