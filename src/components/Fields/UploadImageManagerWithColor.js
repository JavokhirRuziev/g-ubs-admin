import React, {useState} from 'react';

import {FileManager} from "components";
import get from "lodash/get";

import {ReactComponent as DeleteIcon} from "./icons/delete.svg";
import cx from "classnames";
import styled from "styled-components";

const UploadImageManager = ({
                                isDocument = false,
                                limit = 1,
                                label,
                                field,
                                form: {touched, errors, setFieldValue, values},
                                className
                            }) => {
    const [visible, setVisible] = useState(false);

    const removeHandler = selected => {
        setFieldValue(field.name, values[field.name].filter(item => item.id !== selected.id))
    };

    const classNames = cx("upload-photos", touched[field.name] && errors[field.name] && "has-error", className);
    return (
        <>
            <FileManager
                addImage={({selected}) => {
                    let activeColor = get(values, 'color');
                    let activePalette = values.palette.find(p => p.color === activeColor);
                    let withOutActivePalette = [];


                    let newItems = [];
                    if(activePalette){
                        withOutActivePalette = values.palette.filter(p => p.color !== activeColor);
                        newItems = [...withOutActivePalette, {color: activePalette.color, files: [selected, ...activePalette.files]}]
                    }else{
                        newItems = [...values.palette, {color: activeColor, files: [selected]}]
                    }

                    setFieldValue('palette', newItems);
                }}
                onCancel={() => {
                    setVisible(false)
                }}
                visible={visible}
                isDocument={isDocument}
            />
            <div className={classNames}>
                {label && <div className="ant-label">{label}</div>}

                {get(values, 'palette', []).map((palette, i) => (
                    <div className="mb-20">
                        <div className="d-flex align-items-center fw-700 mb-5">
                            Палитра - {palette.color}
                            <Palette theme={{ color: palette.color }} onClick={() => setFieldValue('color', palette.color)}/>
                        </div>
                        <div className="preview-list">
                            {palette.files.map((item, i) => (
                                <div className="preview-item" key={get(item, 'id', `${i}`)}>
                                    <div className="delete-btn" onClick={() => removeHandler(item)}>
                                        <DeleteIcon height={22} width={22}/>
                                    </div>
                                    <img src={get(item, 'thumbnails.small.src')} alt=""/>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="preview-list">
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

const Palette = styled.span`
  display: block;
  width: 15px;
  height: 15px;
  content: "";
  margin-left: 10px;
  border-radius: 2px;
  cursor: pointer;
  background-color: ${props => props.theme.color};
`;


export default UploadImageManager;
