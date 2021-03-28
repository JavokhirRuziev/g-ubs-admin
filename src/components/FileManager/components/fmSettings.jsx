import React, {useEffect, useState} from 'react';
import {Radio, Button, Input, notification, Modal} from "antd";
import get from "lodash/get";
import EntityActions from "modules/entity/actions";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";

const FmSettings = ({size, setSize, selected, filterType, setFilterType}) => {
  const [fileTitle, setFileTitle] = useState(get(selected, 'title'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFileTitle(get(selected, 'title'));
  }, [get(selected, 'title')]);

  const {t} = useTranslation();
  const dispatch = useDispatch();

  const changeFileName = () => {
    dispatch(EntityActions.Form.request({
      method: 'put',
      entity: 'files',
      name: `allFiles-${filterType}`,
      url: `/filemanager/${selected.id}`,
      primaryKey: "id",
      id: selected.id,
      values: {title: fileTitle},
      updateData: true,
      normalizeData: data => data,
      cb: {
        success: () => {
          notification["success"]({
            message: t("Успешно"),
            duration: 2
          });
        },
        error: () => {
          notification["error"]({
            message: t("Что-то пошло не так"),
            duration: 2
          });
        },
        finally: () => {
          // this.setState({ loading: false });
        }
      }
    }))
  };

  const onDeleteHandler = () => {
    Modal.confirm({
      title: t("Вы действительно хотите удалить?"),
      okText: t("да"),
      okType: "danger",
      cancelText: t("нет"),
      confirmLoading: true,
      onOk: () => deleteFile(),
    });
  };

  const deleteFile = () => {
    setLoading(true);
    dispatch(EntityActions.Form.request({
      method: "delete",
      entity: 'files',
      name: `allFiles-${filterType}`,
      url: `/filemanager/${selected.id}`,
      primaryKey: "id",
      id: selected.id,
      deleteData: true,
      cb: {
        success: () => {
          notification["success"]({
            message: t("Успешно удалено"),
            duration: 2
          });
        },
        error: () => {
          notification["error"]({
            message: t("Что-то пошло не так"),
            duration: 2
          });
        },
        finally: () => {
          setLoading(false)
        }
      }
    }))
  };

  const onEnter = (event) => {
    if (event.keyCode === 13) {
      changeFileName();
    }
  };

  const onBlur = (value) => {
    if(get(selected, 'title') !== value){
      changeFileName()
    }
  };

  return (
    <div className="fm-settings">
      <div style={{marginBottom: '20px'}}>
        <div className="label">Фильтр</div>
        <Radio.Group
          defaultValue={filterType}
          onChange={e => {
            setFilterType(e.target.value)
          }}>
          <Radio value="images">Картинки</Radio>
          <Radio value="documents">Документы</Radio>
        </Radio.Group>
      </div>
      <div style={{marginBottom: '20px'}}>
        <div className="label">Размер картинки</div>
        <Radio.Group
          defaultValue={size}
          onChange={e => {
            setSize(e.target.value)
          }}>
          <Radio value="normal">Большой</Radio>
          <Radio value="low">Средный</Radio>
          <Radio value="small">Маленький</Radio>
        </Radio.Group>
      </div>
      {selected && (
        <>
          <div style={{marginBottom: "30px"}}>
            <div className="label">Переименовать названия</div>
            <Input
              name="alt"
              placeholder="текст"
              value={fileTitle}
              onChange={e => setFileTitle(e.target.value)}
              onBlur={(e) => onBlur(e.target.value)}
              onKeyDown={(e) => onEnter(e) }
            />
          </div>
          <div className="delete-image">
            <div className="label">Так же можете удалить картинку.</div>
            <Button type="danger" onClick={() => onDeleteHandler()} loading={loading}>Удалить</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default FmSettings;