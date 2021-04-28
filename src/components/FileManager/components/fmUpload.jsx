import React, {useState, useEffect} from 'react';

import get from "lodash/get";
import {Icon, notification} from "antd";
import {Fields} from "components";
import config from "config";
import Actions from "modules/entity/actions";
import {useDispatch} from "react-redux";

const FmUpload = ({isLoading, setLoading, filterType, activeFolder,useFileName}) => {
    const [files, setValue] = useState([]);
    const [progress, setProgress] = useState("");
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (progress === 100)
            setTimeout(() => {
                setVisible(false);
                setProgress("");
                setVisible(true);
            }, 1000);

    }, [progress]);

    const dispatch = useDispatch();
    const saveEntity = (data) => {
      dispatch(Actions.Append.request({
        entity: 'files',
        name: `allFiles-${filterType}`,
        data: data,
        primaryKey: 'id',
        appendIds: true,
        params: {
          limit: 12,
          sort: "-id",
        }
      }))
    };
    return (
      <div className="fm-upload">
        <Fields.UploadImage
          action={`${config.API_ROOT}/filemanager/uploads`}
          listType={"picture-card"}
          activeFolderId={activeFolder ? activeFolder.id : ''}
          showUploadList={false}
          defaultFileList={files}
          useFileName={useFileName}
          multiple
          acceptAll
          setProgress={setProgress}
          errorCb={(err) => {
              setLoading(false);
              notification["error"]({
                  message: get(err, 'message', 'Что-то пошло не так'),
                  duration: 2
              });
              setTimeout(() => {
                  setVisible(false);
                  setProgress("");
                  setVisible(true);
              }, 1000);
          }}
          disabled={isLoading}
          onChange={({ file }) => {
            setLoading(true);
            let fileList = [];
            [get(file, "response", {})].forEach(f => {
              if (file.status === "done") {
                setLoading(false);
                fileList = [
                  {
                    ...f,
                    uid: f.id,
                    url: get(f, "link"),
                    name: f.title
                  }
                ];
              }
            });
            setValue([...fileList]);
            saveEntity(fileList);
          }}
          onRemove={file => {
            const keys = Object.keys(get(file, "response", {}));
            setValue([...files].filter(f => f.uid !== keys[0]));
          }}>
            <div>
                {isLoading ? (
                    <div className="fm-loading">
                        <div className="fm-loading__indicator"
                             style={{ width: visible && progress > 0 ? `${progress}%` : `${0}` }} />
                        {visible && progress > 0 ? <span>{progress}%</span> : null}
                    </div>
                ) : (
                    <>
                        <Icon type="plus" />
                        <div className="ant-upload-text">{"Загрузите"}</div>
                    </>
                )}
            </div>
        </Fields.UploadImage>
      </div>
    );
};

export default FmUpload;