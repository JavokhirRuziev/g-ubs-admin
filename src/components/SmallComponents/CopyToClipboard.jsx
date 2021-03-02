import React from 'react';
import {Button, notification} from "antd";

const CopyToClipboard = ({str}) => {
  const copyToClipboard = str => {
    var input = document.createElement('input');
    input.value = str;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);

    notification["success"]({
      message: "Упешно скопирован",
      duration: 2
    });
  };
  return (
    <div className="copy-to-clipboard">
      {str}
      <Button
        type="primary"
        size="small"
        icon="copy"
        style={{
          marginLeft: "10px"
        }}
        onClick={() => copyToClipboard(str)}
      />
    </div>
  );
};

export default CopyToClipboard;