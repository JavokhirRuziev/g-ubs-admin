import {Button, Dropdown, Icon, Menu} from "antd";
import React from "react";

const DropdownMenu = ({model, menuList}) => {
  const menu = (
    <Menu>
      {menuList.map((item, i) => (
        <Menu.Item onClick={() => item.onClick(model)} key={i}>
          {item.title}
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <Dropdown key="more" overlay={menu}>
      <Button
        style={{
          border: 'none',
          padding: 0,
        }}
      >
        <Icon
          type="more"
          style={{
            fontSize: 22,
            verticalAlign: 'top',
            fontWeight: 500
          }}
        />
      </Button>
    </Dropdown>
  );
};

export default DropdownMenu;