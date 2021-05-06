import React, {useState} from 'react';

import "./style.scss";
import {Modal} from "antd";

import FMFolders from "./components/fmFolders";
import FMList from "./components/fmList";
import FMListMulti from "./components/fmListMulti";
import FMSettings from "./components/fmSettings";

const FileManager = ({
                         addImage,
                         visible = false,
                         onCancel = () => {},
                         isDocument,
                         isMulti,
                         useFileName
                     }) => {
    const [isLoading, setLoading] = useState(false);
    const [size, setSize] = useState('low');

    const [selected, setSelected] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);

    const [activeFolder, setActiveFolder] = useState(null);
    const [filterType, setFilterType] = useState(isDocument ? 'documents' : 'images');

    return (
        <Modal
            className="file-manager"
            visible={visible}
            onOk={() => {
                if(isMulti){
                    addImage(selectedItems);
                }else{
                    addImage(selected);
                }
                onCancel();
                setTimeout(() => {
                    setSelected(null);
                    setSelectedItems([]);
                }, 300)
            }}
            onCancel={onCancel}
            closable={true}
            destroyOnClose
            title="File Manager"
            width={1048}
        >
            <div className="fm-block">
                <FMFolders {...{setActiveFolder, activeFolder}}/>
                {isMulti ? (
                    <FMListMulti {...{
                        selectedItems,
                        setSelectedItems,
                        filterType,
                        activeFolder,
                        setLoading,
                        isLoading,
                        useFileName
                    }}/>
                ) : (
                    <FMList {...{
                        isMulti,
                        selected,
                        setSelected,
                        filterType,
                        activeFolder,
                        setLoading,
                        isLoading,
                    }}/>
                )}
                <FMSettings {...{size, setSize, selected, filterType, setFilterType}}/>
            </div>
        </Modal>
    );
};

export default FileManager;