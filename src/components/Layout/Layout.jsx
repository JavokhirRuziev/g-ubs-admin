import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import {NetworkError} from 'components';
import Actions from "store/actions";
import "./style.scss";
import { useDispatch } from "react-redux";

const Layout = (props) => {
    const [isCollapsed, setCollapse] = useState(true);
    const {children} = props;
    const dispatch = useDispatch();

    useEffect(() => {
        const windowWidth = window.innerWidth;
        dispatch(Actions.system.SetWindowWidth.request(windowWidth));

        if(windowWidth <= 768){
            setCollapse(false)
        }
    }, []);

    return (
        <div className={`m-layout ${isCollapsed ? 'm-layout--collapsed' : ''}`}>
            <Sidebar {...{isCollapsed, setCollapse}}/>
            <div className="m-wrapper">
                <Header/>
                <div className="m-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;