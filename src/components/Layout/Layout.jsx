import React, {useState} from 'react';
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import "./style.scss";

const Layout = (props) => {
    const [isCollapsed, setCollapse] = useState(true);
    const {children} = props;
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